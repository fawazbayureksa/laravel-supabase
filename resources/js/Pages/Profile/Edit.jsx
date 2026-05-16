import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Save, AlertTriangle, Trash2, AtSign, AlignLeft, Camera, ArrowLeft, Upload } from 'lucide-react';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import Input from '@/Components/Input';
import TextArea from '@/Components/TextArea';
import FileUpload from '@/Components/FileUpload';

export default function Edit({ auth, user }) {
    // Form for profile details
    const profileForm = useForm({
        name: user.name ?? '',
        username: user.username ?? '',
        email: user.email ?? '',
        bio: user.profile?.bio ?? '',
        phone: user.profile?.phone ?? '',
        address: user.profile?.address ?? '',
    });

    // Form for profile picture
    const pictureForm = useForm({
        profil_picture: null,
    });

    const submitProfile = (e) => {
        e.preventDefault();
        profileForm.patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    const submitPicture = (e) => {
        e.preventDefault();
        if (!pictureForm.data.profil_picture) return;

        pictureForm.post(route('profile.upload'), {
            preserveScroll: true,
            onSuccess: () => pictureForm.reset('profil_picture'),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Profile Settings" />

            <div className="py-12 bg-gray-50 dark:bg-[#0f0f0f] min-h-screen">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-3">
                         <button
                            onClick={() => window.history.back()}
                            className="p-2 rounded-xl text-gray-500 hover:text-[#1F6F5F] hover:bg-[#1F6F5F]/5 dark:text-gray-400 dark:hover:bg-white/5 transition-all">
                            <ArrowLeft size={24} />
                        </button>
                        <p className="text-xs font-bold text-[#1F6F5F] uppercase tracking-[0.1em]">Account Settings</p>
                    </div>

                    <div className="mb-8 ml-12">
                        <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">Edit Profile</h1>
                        <p className="mt-2 text-gray-500 dark:text-gray-400 font-medium text-sm">
                            Manage your public identity and personal information.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Profile Picture Section */}
                        <Card className="p-6 overflow-hidden">
                            <h2 className="text-[11px] font-black uppercase tracking-[0.15em] text-gray-400 mb-6 flex items-center gap-2">
                                <Camera size={14} className="text-[#1F6F5F]" />
                                Profile Picture
                            </h2>
                            <form onSubmit={submitPicture} className="space-y-6">
                                <div className="flex flex-col sm:flex-row items-center gap-8">
                                    <div className="relative group">
                                        <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[#1F6F5F] to-[#2a917c] flex items-center justify-center text-white font-bold shadow-2xl shadow-[#1F6F5F]/20 text-4xl overflow-hidden border-4 border-white dark:border-[#1a1a1a]">
                                            {user.profile?.profil_picture ? (
                                                <img src={user.profile.profil_picture} alt={user.name} className="w-full h-full object-cover" />
                                            ) : (
                                                user.name[0]
                                            )}
                                        </div>
                                        <div className="absolute -bottom-2 -right-2 bg-white dark:bg-[#222] p-2 rounded-xl shadow-lg border border-gray-100 dark:border-white/10 text-[#1F6F5F]">
                                            <Camera size={18} />
                                        </div>
                                    </div>
                                    <div className="flex-1 w-full">
                                        <FileUpload 
                                            accept="image/*"
                                            onChange={(file) => pictureForm.setData('profil_picture', file)}
                                            error={pictureForm.errors.profil_picture}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        variant="secondary"
                                        size="sm"
                                        processing={pictureForm.processing}
                                        disabled={!pictureForm.data.profil_picture}
                                    >
                                        <Upload size={16} className="mr-2" />
                                        Update Picture
                                    </Button>
                                </div>
                            </form>
                        </Card>

                        <form onSubmit={submitProfile} className="space-y-6">
                            {/* Basic Info Card */}
                            <Card className="p-6">
                                <h2 className="text-[11px] font-black uppercase tracking-[0.15em] text-gray-400 mb-6 flex items-center gap-2">
                                    <User size={14} className="text-[#1F6F5F]" />
                                    Public Profile
                                </h2>
                                <div className="space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <Input
                                            label="Full Name"
                                            icon={User}
                                            value={profileForm.data.name}
                                            onChange={e => profileForm.setData('name', e.target.value)}
                                            error={profileForm.errors.name}
                                            placeholder="John Doe"
                                        />
                                        <Input
                                            label="Username"
                                            icon={AtSign}
                                            value={profileForm.data.username}
                                            onChange={e => profileForm.setData('username', e.target.value)}
                                            error={profileForm.errors.username}
                                            placeholder="johndoe"
                                        />
                                    </div>

                                    <TextArea
                                        label="Bio"
                                        icon={AlignLeft}
                                        value={profileForm.data.bio}
                                        onChange={e => profileForm.setData('bio', e.target.value)}
                                        error={profileForm.errors.bio}
                                        placeholder="Tell the world about yourself..."
                                        rows={4}
                                    />
                                </div>
                            </Card>

                            {/* Contact Info Card */}
                            <Card className="p-6">
                                <h2 className="text-[11px] font-black uppercase tracking-[0.15em] text-gray-400 mb-6 flex items-center gap-2">
                                    <Mail size={14} className="text-[#1F6F5F]" />
                                    Contact Information
                                </h2>
                                <div className="space-y-5">
                                    <Input
                                        label="Email Address"
                                        type="email"
                                        icon={Mail}
                                        value={profileForm.data.email}
                                        onChange={e => profileForm.setData('email', e.target.value)}
                                        error={profileForm.errors.email}
                                        placeholder="john@example.com"
                                    />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <Input
                                            label="Phone Number"
                                            icon={Phone}
                                            value={profileForm.data.phone}
                                            onChange={e => profileForm.setData('phone', e.target.value)}
                                            error={profileForm.errors.phone}
                                            placeholder="+1 555 000 0000"
                                        />
                                        <Input
                                            label="Location / Address"
                                            icon={MapPin}
                                            value={profileForm.data.address}
                                            onChange={e => profileForm.setData('address', e.target.value)}
                                            error={profileForm.errors.address}
                                            placeholder="San Francisco, CA"
                                        />
                                    </div>
                                </div>
                            </Card>

                            {/* Actions */}
                            <div className="flex items-center justify-between pt-4">
                                <div className="flex items-center gap-4">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        processing={profileForm.processing}
                                        className="px-8"
                                    >
                                        <Save size={18} className="mr-2" />
                                        Save Changes
                                    </Button>

                                    {profileForm.recentlySuccessful && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="text-sm font-bold text-[#1F6F5F] flex items-center gap-2"
                                        >
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="w-5 h-5 rounded-full bg-[#1F6F5F] text-white flex items-center justify-center text-[10px]"
                                            >
                                                ✓
                                            </motion.div>
                                            Profile updated successfully
                                        </motion.span>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Danger Zone */}
                    <div className="mt-16 pt-8 border-t border-gray-100 dark:border-white/5">
                        <Card className="p-6 border-red-100 dark:border-red-900/20 bg-red-50/30 dark:bg-red-900/5">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                                    <AlertTriangle size={20} />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-sm font-black text-red-600 dark:text-red-400 uppercase tracking-widest mb-1">Danger Zone</h2>
                                    <p className="text-sm text-gray-400 font-medium mb-6">
                                        Deleting your account is permanent and cannot be undone. All your posts, followers, and profile data will be removed.
                                    </p>
                                    <Button variant="danger" className="border-red-200 text-white hover:bg-red-600 hover:text-white transition-all">
                                        <Trash2 size={18} className="mr-2" />
                                        Delete Account
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
