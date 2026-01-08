export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 bg-background border-t border-border">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Dasu Prabhukumar
          </p>
          
          <p className="text-sm text-muted-foreground">
            Designed with clarity and purpose.
          </p>
        </div>
      </div>
    </footer>
  );
};
