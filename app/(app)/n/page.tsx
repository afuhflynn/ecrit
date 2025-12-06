import Container from "@/components/container";
import { Footer } from "@/components/footer";
import { UserButton } from "@/components/user-button";

const page = () => {
  return (
    <Container>
      <div className="flex items-center justify-between w-full">
        <h1 className="text-2xl font-bold font-mono">ecrit.</h1>
        <UserButton />
      </div>
      <div className="">nothing</div>
      <Footer />
    </Container>
  );
};

export default page;
