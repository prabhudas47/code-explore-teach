export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 bg-background border-t border-border">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Dasu Prabhukumar. All rights reserved.
          </p>
          
          <p className="text-sm text-muted-foreground">
            Built with focus and clarity.
          </p>
        </div>
      </div>
    </footer>
  );
};