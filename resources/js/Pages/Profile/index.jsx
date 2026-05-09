import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import ActionIcon from '@/Components/ActionIcon';
import TextArea from '@/Components/TextArea';
import CommentModal from '@/Components/CommentModal';
import {
    ArrowLeft,
    Heart,
    MessageCircle,
    Repeat2,
    Bookmark,
    Share2,
    MoreHorizontal,
    SendHorizonal,
    Image as ImageIcon,
    SquareKanban
} from 'lucide-react';

export default function Index({ auth = null, user = null }) {
    return (
         <AuthenticatedLayout>
            <Head title="Profile" />
             <div className="py-2 bg-gray-50 dark:bg-[#0f0f0f] min-h-screen">
                 <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                     {/* Navigation Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            onClick={() => window.history.back()}
                            className="p-2 rounded-xl text-gray-500 hover:text-[#1F6F5F] hover:bg-[#1F6F5F]/5 dark:text-gray-400 dark:hover:bg-white/5 transition-all"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Profile</h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide uppercase">Profile User</p>
                        </div>
                    </div>
                    <Card className='p-5'>
                        <div className='flex justify-between items-center mb-5'>
                            <div>
                                <span className='font-bold'>Nama</span>
                                <div>username</div>
                            </div>
                            <div>
                                <ImageIcon size={100} />
                            </div>
                        </div>
                        <div className='flex'>
                            <div>
                                <span>Biograph</span>
                            </div>  
                        </div>
                        <div className='flex justify-between'>
                            <div className='flex'>
                                <span className='text-sm mr-1 text-gray-300'>100</span>
                                <span className='text-sm text-gray-300'>followers</span>
                            </div>  
                            <div>
                                <SquareKanban size={25} />
                            </div>
                        </div>
                        {/*  */}
                        <div className='flex mt-10'>
                            <button
                                class="w-full rounded-xl border border-gray-200 bg-white py-2 text-sm font-semibold text-gray-900 shadow-sm transition-all hover:shadow-md">
                                 Edit profile
                            </button>
                        </div>
                    </Card>
                 </div>
             </div>
         </AuthenticatedLayout>
    )
}