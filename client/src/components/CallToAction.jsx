import { Button } from 'flowbite-react';

export default function CallToAction() {
  return (
    <div className='flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center'>
      <div className="flex-1 justify-center flex flex-col">
        <h2 className='text-2xl'>
          Want to explore my projects?
        </h2>
        <p className='text-gray-500 my-2'>
          Check out my GitHub repository for all my work.
        </p>
        <Button gradientDuoTone='purpleToPink' className='rounded-tl-xl rounded-bl-none'>
          <a href="https://github.com/nikhilchavan2004" target='_blank' rel='noopener noreferrer'>
            My GitHub Projects
          </a>
        </Button>
      </div>
      <div className="p-7 flex-1">
        <img src="http://ts2.mm.bing.net/th?id=OIP._r_E3MplzjJvJM4Bl3D0cwHaEo&pid=15.1" />
      </div>
    </div>
  );
}
