import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import ChangeEmailDialog from '@/components/ChangeEmailDialog';
import ReauthenticationModal from '@/components/ReauthenticationModal';
import Loader from '@/components/ui/loader';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

const Profile = () => {
  const { user, profile, isLoading, updatePassword, isReauthenticationRequired } = useAuth();
  const { id: profileIdParam } = useParams();
  const [viewedProfile, setViewedProfile] = useState<any>(null);
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
  const [isOwnProfile, setIsOwnProfile] = useState(true);
  
  // Password update states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  
  // Modal states
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [showReauth, setShowReauth] = useState(false);
  const [pendingOperation, setPendingOperation] = useState<(() => void) | null>(null);
  
  // Add state for banking details
  const [bankName, setBankName] = useState(profile?.bank_name || '');
  const [accountName, setAccountName] = useState(profile?.account_name || '');
  const [accountNumber, setAccountNumber] = useState(profile?.account_number || '');
  const [branchName, setBranchName] = useState(profile?.branch_name || '');
  const [branchCode, setBranchCode] = useState(profile?.branch_code || '');
  const [swiftCode, setSwiftCode] = useState(profile?.swift_code || '');
  const [accountType, setAccountType] = useState(profile?.account_type || '');

  // Skills dropdown options (extensive list)
  const skillOptions = Array.from(new Set([
    'Electrician', 'Plumbing', 'Tutoring', 'Babysitting', 'Dog Walking', 'House Sitting', 'Gardening', 'Cleaning', 'IT Support', 'Construction', 'Painting', 'Security', 'Cooking', 'Childcare', 'Transportation', 'Domestic Work', 'Carpentry', 'Mechanic', 'Personal Training', 'Fitness Coaching', 'Graphic Design', 'Web Development', 'Photography', 'Videography', 'Event Planning', 'Catering', 'Makeup Artist', 'Hairdressing', 'Nail Technician', 'Massage Therapy', 'Elderly Care', 'Pet Sitting', 'Laundry', 'Sewing', 'Translation', 'Copywriting', 'Social Media Management', 'Data Entry', 'Virtual Assistance', 'Accounting', 'Bookkeeping', 'Legal Assistance', 'Marketing', 'Sales', 'Driving', 'Moving Services', 'Handyman', 'Roofing', 'Landscaping', 'Pool Maintenance', 'Window Cleaning', 'Pest Control', 'Courier', 'Delivery', 'Barber', 'DJ', 'Music Lessons', 'Dance Lessons', 'Yoga Instruction', 'Fitness Classes', 'Swimming Lessons', 'Surf Lessons', 'Ski Instructor', 'Tour Guide', 'Private Chef', 'Baking', 'Bartending', 'Waitering', 'Hostessing', 'Receptionist', 'Call Center', 'Customer Service', 'Tech Support', 'App Development', 'UI/UX Design', 'Interior Design', 'Property Management', 'Real Estate Agent', 'Auctioneer', 'Valet', 'Security Guard', 'Doorman', 'Concierge', 'Personal Shopper', 'Fashion Stylist', 'Tailoring', 'Shoe Repair', 'Watch Repair', 'Jewelry Repair', 'Locksmith', 'Plastering', 'Tiling', 'Flooring', 'Glazing', 'Scaffolding', 'Demolition', 'Waste Removal', 'Recycling', 'IT Consulting', 'Network Installation', 'PC Repair', 'Mobile Repair', 'Drone Services', '3D Printing', 'CNC Machining', 'Welding', 'Blacksmith', 'Goldsmith', 'Silversmith', 'Upholstery', 'Antique Restoration', 'Furniture Assembly', 'Furniture Repair', 'Window Installation', 'Door Installation', 'Alarm Installation', 'CCTV Installation', 'Satellite Installation', 'Solar Installation', 'Wind Turbine Maintenance', 'Car Wash', 'Boat Cleaning', 'Aircraft Cleaning', 'Logistics', 'Supply Chain', 'Inventory Management', 'Warehouse Work', 'Forklift Operation', 'Crane Operation', 'Heavy Machinery', 'Excavation', 'Surveying', 'Geology', 'Environmental Consulting', 'Waste Management', 'Hazardous Material Handling', 'Fire Safety', 'First Aid', 'Paramedic', 'Nursing', 'Medical Assistance', 'Pharmacy', 'Lab Technician', 'Dentistry', 'Veterinary', 'Animal Grooming', 'Animal Training', 'Dog Breeding', 'Cat Breeding', 'Horse Training', 'Horse Grooming', 'Stable Management', 'Farm Work', 'Agriculture', 'Beekeeping', 'Fishing', 'Hunting', 'Wildlife Management', 'Forestry', 'Park Ranger', 'Game Warden', 'Tourism', 'Travel Planning', 'Ticketing', 'Visa Assistance', 'Language Teaching', 'Music Teaching', 'Art Teaching', 'Science Tutoring', 'Math Tutoring', 'Exam Coaching', 'University Applications', 'Scholarship Applications', 'Resume Writing', 'Career Coaching', 'Life Coaching', 'Business Consulting', 'Startup Mentoring', 'Investment Advice', 'Financial Planning', 'Tax Consulting', 'Insurance Advice', 'Estate Planning', 'Funeral Services', 'Wedding Planning', 'Event Hosting', 'MC', 'Public Speaking', 'Voice Over', 'Acting', 'Modeling', 'Casting', 'Stunt Work', 'Set Design', 'Lighting', 'Sound Engineering', 'Stage Management', 'Production Assistance', 'Directing', 'Script Writing', 'Editing', 'Proofreading', 'Publishing', 'Printing', 'Distribution', 'Courier', 'Logistics', 'Supply Chain', 'Procurement', 'Quality Control', 'Inspection', 'Auditing', 'Compliance', 'Risk Management', 'Project Management', 'Scrum Master', 'Agile Coaching', 'Product Management', 'Business Analysis', 'Market Research', 'Branding', 'Advertising', 'PR', 'Media Buying', 'Influencer Marketing', 'SEO', 'SEM', 'Content Creation', 'Blogging', 'Podcasting', 'Vlogging', 'YouTube Management', 'Twitch Streaming', 'eSports Coaching', 'Game Testing', 'Game Development', 'Animation', '3D Modeling', '2D Art', 'Illustration', 'Cartooning', 'Comics', 'Storyboarding', 'Voice Acting', 'Sound Design', 'Music Production', 'Songwriting', 'Composition', 'Arranging', 'Conducting', 'Orchestration', 'Choir Direction', 'Band Management', 'Tour Management', 'Merchandising', 'Ticket Sales', 'Fan Engagement', 'Community Management', 'Forum Moderation', 'Discord Management', 'Telegram Management', 'WhatsApp Group Management', 'Slack Management', 'Microsoft Teams Management', 'Zoom Hosting', 'Webinar Hosting', 'Online Course Creation', 'eLearning Development', 'Instructional Design', 'Curriculum Development', 'Lesson Planning', 'Exam Setting', 'Grading', 'Assessment', 'Student Counseling', 'Parent Counseling', 'Special Needs Education', 'Speech Therapy', 'Occupational Therapy', 'Physical Therapy', 'Rehabilitation', 'Sports Coaching', 'Athlete Management', 'Scouting', 'Talent Management', 'Casting', 'Audition Coaching', 'Portfolio Development', 'Showreel Editing', 'Demo Reel Production', 'Photography Editing', 'Photo Retouching', 'Video Editing', 'Color Grading', 'Motion Graphics', 'Visual Effects', 'CGI', 'SFX', 'VFX', 'Sound Mixing', 'Mastering', 'Audio Restoration', 'Noise Reduction', 'Podcast Editing', 'Audiobook Production', 'Transcription', 'Translation', 'Subtitling', 'Captioning', 'Dubbing', 'Localization', 'Internationalization', 'Export Consulting', 'Import Consulting', 'Customs Brokerage', 'Freight Forwarding', 'Shipping', 'Maritime Services', 'Port Services', 'Harbor Management', 'Dock Work', 'Stevedoring', 'Cargo Handling', 'Container Management', 'Warehouse Management', 'Inventory Control', 'Stock Taking', 'Order Fulfillment', 'Pick and Pack', 'Delivery Management', 'Route Planning', 'Fleet Management', 'Driver Management', 'Vehicle Maintenance', 'Tyre Fitting', 'Wheel Alignment', 'Panel Beating', 'Spray Painting', 'Auto Detailing', 'Car Wrapping', 'Window Tinting', 'Alarm Installation', 'Tracker Installation', 'Fleet Tracking', 'Telematics', 'Insurance Claims', 'Accident Management', 'Breakdown Assistance', 'Roadside Assistance', 'Towing', 'Recovery', 'Salvage', 'Auction Services', 'Valuation', 'Appraisal', 'Estate Sales', 'Liquidation', 'Bankruptcy Services', 'Debt Collection', 'Credit Control', 'Loan Processing', 'Mortgage Broking', 'Real Estate Broking', 'Property Valuation', 'Surveying', 'Landscaping', 'Horticulture', 'Arboriculture', 'Tree Surgery', 'Tree Felling', 'Stump Removal', 'Garden Design', 'Garden Maintenance', 'Irrigation', 'Water Features', 'Pond Maintenance', 'Aquarium Maintenance', 'Pet Sitting', 'Dog Walking', 'Cat Sitting', 'Bird Sitting', 'Fish Feeding', 'Reptile Care', 'Exotic Pet Care', 'Pet Taxi', 'Pet Boarding', 'Pet Grooming', 'Pet Training', 'Pet Photography', 'Pet Portraits', 'Pet Art', 'Pet Memorials', 'Pet Burial', 'Pet Cremation', 'Pet Insurance', 'Pet Nutrition', 'Pet Supplies', 'Pet Accessories', 'Pet Toys', 'Pet Clothing', 'Pet Furniture', 'Pet Bedding', 'Pet Carriers', 'Pet Travel', 'Pet Relocation', 'Pet Adoption', 'Pet Rescue', 'Pet Fostering', 'Pet Rehoming', 'Pet Welfare', 'Pet Advocacy', 'Pet Fundraising', 'Pet Volunteering', 'Pet Events', 'Pet Shows', 'Pet Competitions', 'Pet Awards', 'Pet Charities', 'Pet Organizations', 'Pet Clubs', 'Pet Societies', 'Pet Forums', 'Pet Blogs', 'Pet Magazines', 'Pet News', 'Pet TV', 'Pet Radio', 'Pet Podcasts', 'Pet Videos', 'Pet Photos', 'Pet Stories', 'Pet Advice', 'Pet Tips', 'Pet Guides', 'Pet Books', 'Pet Courses', 'Pet Training', 'Pet Certification', 'Pet Licensing', 'Pet Registration', 'Pet Microchipping', 'Pet Vaccination', 'Pet Health Checks', 'Pet Surgery', 'Pet Dentistry', 'Pet Orthopedics', 'Pet Oncology', 'Pet Dermatology', 'Pet Cardiology', 'Pet Neurology', 'Pet Ophthalmology', 'Pet Radiology', 'Pet Pathology', 'Pet Rehabilitation', 'Pet Physiotherapy', 'Pet Hydrotherapy', 'Pet Acupuncture', 'Pet Chiropractic', 'Pet Homeopathy', 'Pet Herbalism', 'Pet Nutritionist', 'Pet Behaviorist', 'Pet Trainer', 'Pet Sitter', 'Pet Walker', 'Pet Groomer', 'Pet Boarder', 'Pet Breeder', 'Pet Fosterer', 'Pet Rescuer', 'Pet Advocate', 'Pet Volunteer', 'Pet Fundraiser', 'Pet Event Organizer', 'Pet Show Judge', 'Pet Competition Judge', 'Pet Award Judge', 'Pet Charity Worker', 'Pet Organization Worker', 'Pet Club Member', 'Pet Society Member', 'Pet Forum Moderator', 'Pet Blog Writer', 'Pet Magazine Writer', 'Pet News Reporter', 'Pet TV Presenter', 'Pet Radio Presenter', 'Pet Podcast Host', 'Pet Video Creator', 'Pet Photographer', 'Pet Portrait Artist', 'Pet Story Writer', 'Pet Advice Columnist', 'Pet Tips Writer', 'Pet Guide Writer', 'Pet Book Author', 'Pet Course Creator'
  ]));

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user && !isLoading) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    // If viewing another user's profile
    if (profileIdParam && (!profile || profileIdParam !== user?.id)) {
      const fetchOtherProfile = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', profileIdParam)
          .single();
        if (!error && data) setViewedProfile(data);
      };
      fetchOtherProfile();
    } else {
      setViewedProfile(profile);
    }
  }, [profileIdParam, profile, user]);

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

  const requiresReauthentication = (operation: () => void) => {
    if (isReauthenticationRequired()) {
      setPendingOperation(() => operation);
      setShowReauth(true);
    } else {
      operation();
    }
  };

  const handleReauthSuccess = () => {
    if (pendingOperation) {
      pendingOperation();
      setPendingOperation(null);
    }
  };

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "New password and confirmation do not match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUpdatingPassword(true);
      await updatePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Password update error:', error);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
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
    if (!viewedProfile) return null;
    
    if (viewedProfile.verification_status === 'verified') {
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1 ml-2">
          <Shield className="h-3 w-3" />
          Verified
        </Badge>
      );
    } else if (viewedProfile.verification_status === 'pending') {
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center gap-1 ml-2">
          <Shield className="h-3 w-3" />
          Pending Verification
        </Badge>
      );
    }
    
    return null;
  };

  const getTrustLockBadge = () => {
    if (!viewedProfile) return null;
    if (viewedProfile.verification_status === 'verified') {
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 flex items-center gap-1 ml-2">
          <Shield className="h-3 w-3" />
          TrustLock Verified
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
    <div className="min-h-screen bg-gray-50 dark:bg-[var(--color-card)] py-12">
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
            <Card className="dark:bg-glass hover:shadow-glow focus:shadow-glow active:shadow-glow transition-shadow">
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
                  {viewedProfile?.rating !== undefined && (
                    <div className="flex justify-center mb-4">
                      {renderStars(viewedProfile.rating)}
                    </div>
                  )}
                  
                  {!isOwnProfile && (
                    <div className="flex gap-2 justify-center mb-4">
                      <Button 
                        onClick={() => handleContact(viewedProfile?.id || '')}
                        className="flex-1"
                        variant="default"
                      >
                        Message
                      </Button>
                      <Button 
                        onClick={() => handleHire(viewedProfile?.id || '')}
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
                {viewedProfile?.verification_status !== 'verified' && (
                  <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <span className="font-semibold text-blue-700">Get TrustLock Verified</span>
                    </div>
                    <p className="text-blue-700 text-sm mb-2">Verify your identity and credentials to earn the TrustLock badge and unlock premium features.</p>
                    <Button variant="secondary" size="sm" onClick={() => setActiveTab('verification')}>
                      Start Verification
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="mt-6 dark:bg-glass hover:shadow-glow focus:shadow-glow active:shadow-glow transition-shadow">
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
                  
                  {viewedProfile?.jobs_completed !== undefined && viewedProfile?.jobs_completed > 0 && (
                    <div>
                      <span className="text-muted-foreground">Jobs completed:</span>
                      <span className="block font-medium">{viewedProfile.jobs_completed}</span>
                    </div>
                  )}
                  
                  {viewedProfile?.jobs_completed !== undefined && viewedProfile?.jobs_completed >= 5 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Badge className="bg-purple-500 hover:bg-purple-600 flex gap-1 items-center">
                        <Award className="h-3 w-3" /> Experienced (5+ Jobs)
                      </Badge>
                    </div>
                  )}
                  
                  {viewedProfile?.jobs_completed !== undefined && viewedProfile?.jobs_completed >= 20 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge className="bg-blue-500 hover:bg-blue-600 flex gap-1 items-center">
                        <Award className="h-3 w-3" /> Professional (20+ Jobs)
                      </Badge>
                    </div>
                  )}
                  
                  {viewedProfile?.jobs_completed !== undefined && viewedProfile?.jobs_completed >= 50 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge className="bg-amber-500 hover:bg-amber-600 flex gap-1 items-center">
                        <Award className="h-3 w-3" /> Expert (50+ Jobs)
                      </Badge>
                    </div>
                  )}
                  
                  {viewedProfile?.verification_status === 'verified' && (
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
              <Card className="dark:bg-glass hover:shadow-glow focus:shadow-glow active:shadow-glow transition-shadow">
                <CardHeader className="pb-3">
                  <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-4">
                      <TabsTrigger value="personal">Personal Info</TabsTrigger>
                      <TabsTrigger value="account">Account & Security</TabsTrigger>
                      <TabsTrigger value="verification">Verification</TabsTrigger>
                      <TabsTrigger value="certificates">Certificates</TabsTrigger>
                    </TabsList>
                    
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
                          <div className="flex gap-2 items-center">
                            <Select
                              value=""
                              onValueChange={(value) => {
                                if (value && !skills.includes(value)) {
                                  setSkills([...skills, value]);
                                }
                              }}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a skill" />
                              </SelectTrigger>
                              <SelectContent>
                                {skillOptions.map((option) => (
                                  <SelectItem key={option} value={option} disabled={skills.includes(option)}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
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

                    <TabsContent value="account" className="mt-0">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-4">Email Address</h3>
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <p className="font-medium">{user.email}</p>
                              <p className="text-sm text-muted-foreground">
                                {user.email_confirmed_at ? 'Verified' : 'Unverified'}
                              </p>
                            </div>
                            <Button 
                              variant="outline" 
                              onClick={() => requiresReauthentication(() => setShowChangeEmail(true))}
                            >
                              Change Email
                            </Button>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-medium mb-4">Password</h3>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="currentPassword">Current Password</Label>
                              <Input
                                id="currentPassword"
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Enter current password"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="newPassword">New Password</Label>
                              <Input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password (min 6 characters)"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="confirmPassword">Confirm New Password</Label>
                              <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                              />
                            </div>
                            
                            <Button 
                              onClick={handlePasswordUpdate}
                              disabled={!currentPassword || !newPassword || !confirmPassword || isUpdatingPassword}
                            >
                              {isUpdatingPassword ? "Updating..." : "Update Password"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="verification" className="mt-0">
                      <div className="space-y-6">
                        <div>
                          <Label className="mb-2 block">ID Verification</Label>
                          <p className="text-sm text-muted-foreground mb-4">
                            Upload a government-issued ID document for verification. This helps build trust on the platform.
                            <br />Verification status: {viewedProfile?.verification_status || 'Not submitted'}
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
                  </Tabs>
                </CardHeader>
                <CardContent>
                  {/* Empty CardContent since we moved the TabsContent components inside the Tabs */}
                </CardContent>
              </Card>
            ) : (
              // View-only profile for other users
              <Card className="dark:bg-glass hover:shadow-glow focus:shadow-glow active:shadow-glow transition-shadow">
                <CardHeader>
                  <CardTitle>About {firstName}</CardTitle>
                  <CardDescription>
                    {viewedProfile?.bio || 'No bio provided.'}
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
                      <p>{viewedProfile?.jobs_completed || 0} jobs completed</p>
                    </div>
                    
                    {viewedProfile?.verification_status === 'verified' && (
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
      
      <ChangeEmailDialog 
        isOpen={showChangeEmail} 
        onClose={() => setShowChangeEmail(false)} 
      />
      
      <ReauthenticationModal
        isOpen={showReauth}
        onClose={() => {
          setShowReauth(false);
          setPendingOperation(null);
        }}
        onSuccess={handleReauthSuccess}
        title="Security Check Required"
        description="Please confirm your password to continue with this secure operation."
      />
    </div>
  );
};

export default Profile;
