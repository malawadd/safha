interface Props {
    children: React.ReactNode;
  }
  
  const Menu = ({ children }: Props) => {
    return (
      <div className="fixed top-8 right-10 space-x-2 z-50 flex flex-row">
        {children}
      </div>
    );  };
  
  export default Menu;