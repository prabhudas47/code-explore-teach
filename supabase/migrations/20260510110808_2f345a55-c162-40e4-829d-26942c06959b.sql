-- 1. Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin');

-- 2. Create user_roles table
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role public.app_role NOT NULL,
    UNIQUE (user_id, role)
);

-- 3. Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 5. Assign admin role to existing admin user
INSERT INTO public.user_roles (user_id, role)
VALUES ('fd746ac7-3501-4b72-b0d7-9bcf1fd23a83', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- 6. Policies for user_roles (only admin can manage)
CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 7. Drop existing overly permissive portfolio_content policies
DROP POLICY IF EXISTS "Authenticated users can insert portfolio content" ON public.portfolio_content;
DROP POLICY IF EXISTS "Authenticated users can update portfolio content" ON public.portfolio_content;
DROP POLICY IF EXISTS "Authenticated users can delete portfolio content" ON public.portfolio_content;

-- 8. Re-create admin-only write policies for portfolio_content
CREATE POLICY "Admins can insert portfolio content"
ON public.portfolio_content
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update portfolio content"
ON public.portfolio_content
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete portfolio content"
ON public.portfolio_content
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 9. Drop existing overly permissive storage policies for portfolio-media
DROP POLICY IF EXISTS "Authenticated users can upload portfolio media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update portfolio media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete portfolio media" ON storage.objects;

-- 10. Re-create admin-only storage policies
CREATE POLICY "Admins can upload portfolio media"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update portfolio media"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'portfolio-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete portfolio media"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'portfolio-media' AND public.has_role(auth.uid(), 'admin'));

-- 11. Also fix the UPDATE on portfolio_content (was missing DELETE earlier, now added)
-- The SELECT policy stays as public read (USING true) which is intentional

-- 12. Add user_roles row for existing admin if not exists (double check)
INSERT INTO public.user_roles (user_id, role)
SELECT 'fd746ac7-3501-4b72-b0d7-9bcf1fd23a83', 'admin'
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_roles WHERE user_id = 'fd746ac7-3501-4b72-b0d7-9bcf1fd23a83' AND role = 'admin'
);