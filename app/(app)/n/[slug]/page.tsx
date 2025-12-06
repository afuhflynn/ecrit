type Params = { params: Promise<{ slug: string }> };

const NotePage = async ({ params }: Params) => {
  const { slug } = await params;
  return <div>NotePage: {slug}</div>;
};

export default NotePage;
