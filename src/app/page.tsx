import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const { userId } = await auth();

  return (
    <div>
      <h1>Welcome</h1>
      <p>Your user ID is: {userId}</p>
    </div>
  );
}
