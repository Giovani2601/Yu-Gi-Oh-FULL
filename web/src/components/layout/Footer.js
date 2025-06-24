import React from 'react';

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-red-900 to-black">
      <div className="container mx-auto py-4 px-4">
        <p className="open-sans-text text-center text-sm text-white opacity-30">
          © {new Date().getFullYear()} Yu-Gi-Oh App | Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
