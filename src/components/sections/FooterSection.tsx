import { usePortfolioData } from '@/hooks/usePortfolioData';

const defaultFooter = { text: '© 2026 DASU Prabhukumar — Built with precision.' };

export const FooterSection = () => {
  const { data } = usePortfolioData('footer', defaultFooter);

  return (
    <footer className="py-10 border-t border-border">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <p className="text-xs text-muted-foreground tracking-wider">{data.text}</p>
      </div>
    </footer>
  );
};
