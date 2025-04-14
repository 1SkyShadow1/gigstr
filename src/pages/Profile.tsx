
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, X, Shield, Award, Check, Star } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Profile = () => {
  const { user, profile, isLoading } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [verificationDocs, setVerificationDocs] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('personal');
  const [isOwnProfile, setIsOwnProfile] = useState(true); // Default to own profile view
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user && !isLoading) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (profile) {
      setAvatarUrl(profile.avatar_url);
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
      setUsername(profile.username || '');
      setBio(profile.bio || '');
      setSkills(profile.skills || []);
      fetchVerificationDocs();
      fetchCertificates();
    }
  }, [profile]);

  const fetchVerificationDocs = async () => {
    if (!user) return;
    
    try {
      const { data: docsData, error: docsError } = await supabase
        .storage
        .from('verification_docs')
        .list(user.id + '/');
      
      if (docsError) throw docsError;
      setVerificationDocs(docsData || []);
    } catch (error: any) {
      console.error('Error fetching verification docs:', error.message);
    }
  };

  const fetchCertificates = async () => {
    if (!user) return;
    
    try {
      const { data: certsData, error: certsError } = await supabase
        .storage
        .from('certificates')
        .list(user.id + '/');
      
      if (certsError) throw certsError;
      setCertificates(certsData || []);
    } catch (error: any) {
      console.error('Error fetching certificates:', error.message);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user!.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      // Check if the avatars bucket exists and create it if it doesn't
      const { data: buckets } = await supabase.storage.listBuckets();
      if (!buckets?.find(bucket => bucket.name === 'avatars')) {
        await supabase.storage.createBucket('avatars', { public: true });
      }

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      setAvatarUrl(data.publicUrl);
      
      toast({
        title: "Success",
        description: "Avatar uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error uploading avatar",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDocUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'verification' | 'certificate') => {
    try {
      if (!event.target.files || event.target.files.length === 0 || !user) {
        return;
      }
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}-${file.name}`;
      const bucketName = type === 'verification' ? 'verification_docs' : 'certificates';
      
      // Check if the bucket exists and create it if it doesn't
      const { data: buckets } = await supabase.storage.listBuckets();
      if (!buckets?.find(bucket => bucket.name === bucketName)) {
        await supabase.storage.createBucket(bucketName, { public: false });
      }

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file);

      if (uploadError) throw uploadError;
      
      toast({
        title: "Success",
        description: type === 'verification' ? "Verification document uploaded successfully" : "Certificate uploaded successfully",
      });

      // Refresh the list
      if (type === 'verification') {
        fetchVerificationDocs();
      } else {
        fetchCertificates();
      }

      // If this is the first verification document, update verification status
      if (type === 'verification' && verificationDocs.length === 0) {
        await supabase
          .from('profiles')
          .update({ verification_status: 'pending' })
          .eq('id', user.id);
      }
    } catch (error: any) {
      toast({
        title: `Error uploading ${type === 'verification' ? 'document' : 'certificate'}`,
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteFile = async (fileName: string, type: 'verification' | 'certificate') => {
    try {
      if (!user) return;
      
      const bucketName = type === 'verification' ? 'verification_docs' : 'certificates';
      const filePath = `${user.id}/${fileName}`;
      
      const { error: deleteError } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);

      if (deleteError) throw deleteError;
      
      toast({
        title: "Success",
        description: type === 'verification' ? "Document deleted successfully" : "Certificate deleted successfully",
      });
      
      // Refresh the list
      if (type === 'verification') {
        fetchVerificationDocs();
      } else {
        fetchCertificates();
      }
    } catch (error: any) {
      toast({
        title: `Error deleting ${type === 'verification' ? 'document' : 'certificate'}`,
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setIsUpdating(true);
      
      const updates = {
        id: user!.id,
        first_name: firstName,
        last_name: lastName,
        username,
        bio,
        skills,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      };
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user!.id);
        
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleContact = (profileId: string) => {
    // Navigate to messages with the profile ID
    navigate(`/messages?recipient=${profileId}`);
  };

  const handleHire = (profileId: string) => {
    // Navigate to create gig with the worker ID pre-filled
    navigate(`/create-gig?worker=${profileId}`);
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gigstr-purple"></div>
      </div>
    );
  }

  const getInitials = () => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    return user.email?.substring(0, 2).toUpperCase() || 'U';
  };

  const getVerificationBadge = () => {
    if (!profile) return null;
    
    if (profile.verification_status === 'verified') {
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1 ml-2">
          <Shield className="h-3 w-3" />
          Verified
        </Badge>
      );
    } else if (profile.verification_status === 'pending') {
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center gap-1 ml-2">
          <Shield className="h-3 w-3" />
          Pending Verification
        </Badge>
      );
    }
    
    return null;
  };

  const renderStars = (rating: number = 0) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star}
            className={`h-4 w-4 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
        <span className="ml-1 text-sm">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {isOwnProfile ? 'Edit Profile' : `${firstName} ${lastName}'s Profile`}
          </h1>
          <p className="text-muted-foreground">
            {isOwnProfile 
              ? 'Update your personal information and profile' 
              : `View ${firstName}'s profile and work history`
            }
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>
                  {isOwnProfile ? 'Upload a profile picture' : `${firstName}'s profile picture`}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="mb-4 relative">
                  <Avatar className="h-32 w-32 border-4 border-muted">
                    {avatarUrl ? (
                      <AvatarImage src={avatarUrl} />
                    ) : (
                      <AvatarFallback className="bg-gigstr-purple text-white text-4xl">
                        {getInitials()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  
                  {getVerificationBadge() && (
                    <div className="absolute -bottom-2 -right-2">
                      {getVerificationBadge()}
                    </div>
                  )}
                </div>

                <div className="w-full">
                  {profile?.rating !== undefined && (
                    <div className="flex justify-center mb-4">
                      {renderStars(profile.rating)}
                    </div>
                  )}
                  
                  {!isOwnProfile && (
                    <div className="flex gap-2 justify-center mb-4">
                      <Button 
                        onClick={() => handleContact(profile?.id || '')}
                        className="flex-1"
                        variant="default"
                      >
                        Message
                      </Button>
                      <Button 
                        onClick={() => handleHire(profile?.id || '')}
                        className="flex-1"
                      >
                        Hire
                      </Button>
                    </div>
                  )}
                  
                  {isOwnProfile && (
                    <>
                      <Label htmlFor="avatar" className="mb-2 block">Choose file</Label>
                      <Input id="avatar" type="file" accept="image/*" onChange={handleAvatarUpload} />
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Account Info</CardTitle>
                <CardDescription>Your account details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Email:</span>
                    <span className="block font-medium">{user.email}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Member since:</span>
                    <span className="block font-medium">
                      {new Date(user.created_at || '').toLocaleDateString('en-ZA')}
                    </span>
                  </div>
                  
                  {profile?.jobs_completed !== undefined && profile?.jobs_completed > 0 && (
                    <div>
                      <span className="text-muted-foreground">Jobs completed:</span>
                      <span className="block font-medium">{profile.jobs_completed}</span>
                    </div>
                  )}
                  
                  {profile?.jobs_completed !== undefined && profile?.jobs_completed >= 5 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Badge className="bg-purple-500 hover:bg-purple-600 flex gap-1 items-center">
                        <Award className="h-3 w-3" /> Experienced (5+ Jobs)
                      </Badge>
                    </div>
                  )}
                  
                  {profile?.jobs_completed !== undefined && profile?.jobs_completed >= 20 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge className="bg-blue-500 hover:bg-blue-600 flex gap-1 items-center">
                        <Award className="h-3 w-3" /> Professional (20+ Jobs)
                      </Badge>
                    </div>
                  )}
                  
                  {profile?.jobs_completed !== undefined && profile?.jobs_completed >= 50 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge className="bg-amber-500 hover:bg-amber-600 flex gap-1 items-center">
                        <Award className="h-3 w-3" /> Expert (50+ Jobs)
                      </Badge>
                    </div>
                  )}
                  
                  {profile?.verification_status === 'verified' && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge className="bg-green-500 hover:bg-green-600 flex gap-1 items-center">
                        <Shield className="h-3 w-3" /> ID Verified
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content */}
          <div className="lg:col-span-2">
            {isOwnProfile ? (
              <Card>
                <CardHeader className="pb-3">
                  <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-4">
                      <TabsTrigger value="personal">Personal Info</TabsTrigger>
                      <TabsTrigger value="verification">Verification</TabsTrigger>
                      <TabsTrigger value="certificates">Certificates</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardHeader>
                <CardContent>
                  <TabsContent value="personal" className="mt-0">
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName" className="mb-2 block">First Name</Label>
                          <Input 
                            id="firstName" 
                            value={firstName} 
                            onChange={(e) => setFirstName(e.target.value)} 
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName" className="mb-2 block">Last Name</Label>
                          <Input 
                            id="lastName" 
                            value={lastName} 
                            onChange={(e) => setLastName(e.target.value)} 
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="username" className="mb-2 block">Username</Label>
                        <Input 
                          id="username" 
                          value={username} 
                          onChange={(e) => setUsername(e.target.value)} 
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="bio" className="mb-2 block">Bio</Label>
                        <Textarea 
                          id="bio" 
                          value={bio} 
                          onChange={(e) => setBio(e.target.value)} 
                          rows={4}
                          placeholder="Tell others about your skills and expertise..."
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="skills" className="mb-2 block">Skills</Label>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {skills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="flex items-center gap-1">
                              {skill}
                              <X 
                                className="h-3 w-3 cursor-pointer" 
                                onClick={() => handleRemoveSkill(skill)}
                              />
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input 
                            id="skills" 
                            value={newSkill} 
                            onChange={(e) => setNewSkill(e.target.value)} 
                            placeholder="Add a skill"
                            onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                          />
                          <Button 
                            type="button" 
                            onClick={handleAddSkill} 
                            size="icon"
                          >
                            <PlusCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex justify-end pt-4">
                        <Button 
                          type="button" 
                          onClick={handleUpdateProfile} 
                          disabled={isUpdating}
                        >
                          {isUpdating ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="verification" className="mt-0">
                    <div className="space-y-6">
                      <div>
                        <Label className="mb-2 block">ID Verification</Label>
                        <p className="text-sm text-muted-foreground mb-4">
                          Upload a government-issued ID document for verification. This helps build trust on the platform.
                          <br />Verification status: {profile?.verification_status || 'Not submitted'}
                        </p>

                        <div className="border rounded-md p-4 mb-4">
                          {verificationDocs.length > 0 ? (
                            <div className="space-y-2">
                              {verificationDocs.map((doc) => (
                                <div key={doc.name} className="flex justify-between items-center">
                                  <span className="text-sm">{doc.name}</span>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => handleDeleteFile(doc.name, 'verification')}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-center text-muted-foreground">
                              No verification documents uploaded
                            </p>
                          )}
                        </div>

                        <Label htmlFor="verification" className="mb-2 block">Upload ID Document</Label>
                        <Input 
                          id="verification" 
                          type="file" 
                          accept="image/*,.pdf" 
                          onChange={(e) => handleDocUpload(e, 'verification')} 
                        />
                        
                        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-3">
                          <p className="text-sm text-blue-800">
                            <strong>Note:</strong> Your documents are securely stored and only viewed by our verification team. 
                            Verification usually takes 1-2 business days.
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="certificates" className="mt-0">
                    <div className="space-y-6">
                      <div>
                        <Label className="mb-2 block">Professional Certificates</Label>
                        <p className="text-sm text-muted-foreground mb-4">
                          Upload certificates, qualifications, or licenses relevant to your work. 
                          These will be displayed on your public profile after verification.
                        </p>

                        <div className="border rounded-md p-4 mb-4">
                          {certificates.length > 0 ? (
                            <div className="space-y-2">
                              {certificates.map((cert) => (
                                <div key={cert.name} className="flex justify-between items-center">
                                  <span className="text-sm">{cert.name}</span>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => handleDeleteFile(cert.name, 'certificate')}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-center text-muted-foreground">
                              No certificates uploaded
                            </p>
                          )}
                        </div>

                        <Label htmlFor="certificate" className="mb-2 block">Upload Certificate</Label>
                        <Input 
                          id="certificate" 
                          type="file" 
                          accept="image/*,.pdf" 
                          onChange={(e) => handleDocUpload(e, 'certificate')} 
                        />
                      </div>
                    </div>
                  </TabsContent>
                </CardContent>
              </Card>
            ) : (
              // View-only profile for other users
              <Card>
                <CardHeader>
                  <CardTitle>About {firstName}</CardTitle>
                  <CardDescription>
                    {profile?.bio || 'No bio provided.'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {skills && skills.length > 0 ? (
                          skills.map((skill, index) => (
                            <Badge key={index} variant="secondary">
                              {skill}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-muted-foreground">No skills listed</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Completed Jobs</h3>
                      <p>{profile?.jobs_completed || 0} jobs completed</p>
                    </div>
                    
                    {profile?.verification_status === 'verified' && (
                      <div className="bg-green-50 border border-green-200 rounded-md p-3">
                        <div className="flex items-center">
                          <Shield className="h-5 w-5 text-green-600 mr-2" />
                          <div>
                            <p className="font-medium text-green-800">ID Verified</p>
                            <p className="text-sm text-green-700">
                              This worker has been verified by our team
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
