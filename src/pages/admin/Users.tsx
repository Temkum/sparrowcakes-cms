import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';

// TypeScript interfaces
interface User {
  id: string;
  name: string;
  title: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Member';
}

// Example data
const initialUsers: User[] = [
  {
    id: '1',
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member',
  },
  {
    id: '2',
    name: 'Courtney Henry',
    title: 'Designer',
    email: 'courtney.henry@example.com',
    role: 'Admin',
  },
  {
    id: '3',
    name: 'Tom Cook',
    title: 'Director of Product',
    email: 'tom.cook@example.com',
    role: 'Member',
  },
  {
    id: '4',
    name: 'Whitney Francis',
    title: 'Copywriter',
    email: 'whitney.francis@example.com',
    role: 'Admin',
  },
  {
    id: '5',
    name: 'Leonard Krasner',
    title: 'Senior Designer',
    email: 'leonard.krasner@example.com',
    role: 'Owner',
  },
  {
    id: '6',
    name: 'Floyd Miles',
    title: 'Principal Designer',
    email: 'floyd.miles@example.com',
    role: 'Member',
  },
];

const Users = () => {
  const [users, setUsers] = React.useState<User[]>(initialUsers);

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 mx-auto h-full w-full px-4 md:px-6 lg:px-8 xl:max-w-7xl">
        <div className="min-h-[100vh] rounded-xl bg-muted/50 md:min-h-min">
          <Card className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-2xl font-semibold mb-1">Users</h1>
                <p className="text-sm text-gray-500">
                  A list of all the users in your account including their name,
                  title, email and role.
                </p>
              </div>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Add user
              </Button>
            </div>

            {/* Users Table */}
            <div className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-12">
                      <Checkbox />
                    </TableHead>
                    <TableHead className="font-medium">Name</TableHead>
                    <TableHead className="font-medium">Title</TableHead>
                    <TableHead className="font-medium">Email</TableHead>
                    <TableHead className="font-medium">Role</TableHead>
                    <TableHead className="w-20"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="hover:bg-gray-50">
                      <TableCell className="w-12">
                        <Checkbox />
                      </TableCell>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className="text-gray-500">
                        {user.title}
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {user.email}
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {user.role}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </div>
    </>
    // <div className="p-6 max-w-7xl mx-auto">
    //   <Card className="p-6">
    //     {/* Header */}
    //     <div className="flex justify-between items-center mb-4">
    //       <div>
    //         <h1 className="text-2xl font-semibold mb-1">Users</h1>
    //         <p className="text-sm text-gray-500">
    //           A list of all the users in your account including their name,
    //           title, email and role.
    //         </p>
    //       </div>
    //       <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
    //         Add user
    //       </Button>
    //     </div>

    //     {/* Users Table */}
    //     <div className="mt-6">
    //       <Table>
    //         <TableHeader>
    //           <TableRow className="hover:bg-transparent">
    //             <TableHead className="w-12">
    //               <Checkbox />
    //             </TableHead>
    //             <TableHead className="font-medium">Name</TableHead>
    //             <TableHead className="font-medium">Title</TableHead>
    //             <TableHead className="font-medium">Email</TableHead>
    //             <TableHead className="font-medium">Role</TableHead>
    //             <TableHead className="w-20"></TableHead>
    //           </TableRow>
    //         </TableHeader>
    //         <TableBody>
    //           {users.map((user) => (
    //             <TableRow key={user.id} className="hover:bg-gray-50">
    //               <TableCell className="w-12">
    //                 <Checkbox />
    //               </TableCell>
    //               <TableCell className="font-medium">{user.name}</TableCell>
    //               <TableCell className="text-gray-500">{user.title}</TableCell>
    //               <TableCell className="text-gray-500">{user.email}</TableCell>
    //               <TableCell className="text-gray-500">{user.role}</TableCell>
    //               <TableCell>
    //                 <Button
    //                   variant="ghost"
    //                   className="text-indigo-600 hover:text-indigo-900"
    //                 >
    //                   Edit
    //                 </Button>
    //               </TableCell>
    //             </TableRow>
    //           ))}
    //         </TableBody>
    //       </Table>
    //     </div>
    //   </Card>
    // </div>
  );
};

export default Users;
