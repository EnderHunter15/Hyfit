import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import WorkoutTimer from '@/components/workoutTimer';

export default function WorkoutPage() {
  return (
    <div className='flex flex-col'>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant='default' className='capitalize m-10 p-6 rounded-2xl'>
            start empty workout
          </Button>
        </DialogTrigger>
        <DialogContent className='h-80'>
          <DialogHeader>
            <DialogTitle>
              <WorkoutTimer />
            </DialogTitle>
            <DialogDescription>Keep track of your workout by adding exercises</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger asChild>
          <Button className='capitalize m-10 p-6 rounded-2xl' variant='default'>
            create a routine
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            asdsad
            <DialogTitle>asdsad</DialogTitle>
            <DialogDescription>asdasdas</DialogDescription>
            <Input type='search' placeholder='Search for an exercise' className='rounded-2xl' />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
