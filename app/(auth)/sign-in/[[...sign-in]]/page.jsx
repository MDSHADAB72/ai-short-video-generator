
import { SignIn } from '@clerk/nextjs';
import Image from 'next/image';

export default function Page() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen items-center bg-gray-100">
      {/* Left Section: Image */}
      <div className="flex justify-center items-center p-4">
        <Image
          src="/login.jpeg"
          alt="Login Illustration"
          width={500}
          height={500}
          className="rounded-lg shadow-lg max-h-lvh object-cover" 
        />
      </div>

      {/* Right Section: Sign-In Form */}
      <div className="flex justify-center items-center p-4">
        <SignIn />
      </div>
    </div>
  );
}




// import { SignIn } from '@clerk/nextjs';
// import Image from 'next/image';

// export default function Page() {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen items-center bg-gray-100">
//       {/* Left Section: Image */}
//       <div className="flex justify-center items-center p-4">
//         <Image
//           src="/login.jpeg"
//           alt="Illustration of a user signing in to the platform"
//           width={500}
//           height={500}
//           priority
//           className="rounded-lg shadow-lg max-h-screen object-cover" 
//         />
//       </div>

//       {/* Right Section: Sign-In Form */}
//       <div className="flex justify-center items-center min-h-screen p-4">
//         <SignIn />
//       </div>
//     </div>
//   );
// }
