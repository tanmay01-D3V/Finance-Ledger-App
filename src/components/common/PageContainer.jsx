const PageContainer = ({
  children
}) => {
  return (
    <div
      className="
        p-8
        space-y-6
      "
    >
      {children}
    </div>
  );
};

export default PageContainer;