import React from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import TextArea from '../../Components/TextArea';
import Button from '../../Components/Button';
import FileUpload from '../../Components/FileUpload';
import { SendHorizonal } from 'lucide-react';

export default function Index({ posts }) {
    return (
        <AuthenticatedLayout>
            <Head title="Posts" />
            <div className="py-5">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-3">

                        {/* Input text area for content */}
                        <div className='flex flex-col gap-2'>
                            <TextArea placeholder="What's on your mind?" />
                            <div className="flex justify-end gap-2 mt-2">
                                <Button variant="primary" icon={SendHorizonal}>Post</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
