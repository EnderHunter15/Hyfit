type exerciseProps = {
  exercise: {
    id: string;
    name: string;
    category: string;
  };
};

export default function Exercise({ exercise }: exerciseProps) {
  return <div>{exercise.name}</div>;
}
