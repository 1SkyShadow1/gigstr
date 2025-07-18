import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, FileText, Gavel } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle, FileText as FileIcon, Handshake, Lock, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { format } from 'date-fns';
import { Paperclip, Send, UserCheck, UserX, MessageCircle, Image as ImageIcon } from 'lucide-react';

const TrustLock = () => {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('verification');
  const [step, setStep] = useState(1);
  const [uploadedDocs, setUploadedDocs] = useState({ id: null, address: null, cert: null });
  const [status, setStatus] = useState(profile?.verification_status || 'unverified');

  // Simulate real-time status update (replace with real API logic)
  React.useEffect(() => {
    setStatus(profile?.verification_status || 'unverified');
  }, [profile]);

  const handleUpload = (type: 'id' | 'address' | 'cert', file: File) => {
    setUploadedDocs((prev) => ({ ...prev, [type]: file.name }));
    // TODO: Upload logic
  };

  const getStatusBadge = () => {
    if (status === 'verified') {
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200 flex items-center gap-1"><Shield className="h-3 w-3" /> TrustLock Verified</Badge>;
    }
    if (status === 'pending') {
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center gap-1"><Shield className="h-3 w-3" /> Pending Review</Badge>;
    }
    return <Badge className="bg-gray-100 text-gray-700 border-gray-200 flex items-center gap-1"><Shield className="h-3 w-3" /> Not Verified</Badge>;
  };

  const agreementTemplates = [
    { label: 'One-Time Repair', value: 'one_time' },
    { label: 'Recurring Service', value: 'recurring' },
    { label: 'Project-Based Work', value: 'project' },
  ];
  const paymentSchedules = [
    { label: '100% on Completion', value: 'full' },
    { label: '50% Upfront, 50% on Completion', value: 'split' },
    { label: 'Custom', value: 'custom' },
  ];
  const paymentMethods = [
    { label: 'Cash', value: 'cash' },
    { label: 'EFT', value: 'eft' },
    { label: 'Other', value: 'other' },
  ];

  function AgreementForm() {
    const [step, setStep] = useState(1);
    const [template, setTemplate] = useState('one_time');
    const [scope, setScope] = useState('');
    const [materials, setMaterials] = useState('client');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [cost, setCost] = useState('');
    const [schedule, setSchedule] = useState('full');
    const [method, setMethod] = useState('cash');
    const [review, setReview] = useState(false);
    const [signed, setSigned] = useState(false);
    const [signature, setSignature] = useState('');
    const [timestamp, setTimestamp] = useState('');
    const [ip, setIp] = useState('');

    // Simulate IP and timestamp
    React.useEffect(() => {
      if (signed) {
        setTimestamp(format(new Date(), 'yyyy-MM-dd HH:mm:ss'));
        setIp('192.0.2.1'); // TODO: Replace with real IP
      }
    }, [signed]);

    const handleReview = () => setReview(true);
    const handleSign = () => {
      setSigned(true);
      setSignature('I Agree');
    };

    if (signed) {
      return (
        <div className="text-center animate-fade-in">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2 animate-bounce" />
          <div className="text-xl font-bold text-green-700 mb-2">Agreement Signed!</div>
          <div className="mb-2">Timestamp: <span className="font-mono">{timestamp}</span></div>
          <div className="mb-4">IP: <span className="font-mono">{ip}</span></div>
          <div className="mb-4 text-muted-foreground">A PDF copy will be generated and available for download soon.</div>
          <Button variant="secondary" onClick={() => window.print()}><FileIcon className="mr-2 h-4 w-4" /> Download PDF</Button>
        </div>
      );
    }

    if (review) {
      return (
        <div className="animate-fade-in">
          <div className="mb-4 p-4 border rounded bg-gray-50">
            <div className="flex items-center gap-2 mb-2"><Lock className="h-4 w-4 text-blue-600" /> <span className="font-semibold">TrustLock Agreement Preview</span></div>
            <div className="mb-2"><b>Template:</b> {agreementTemplates.find(t => t.value === template)?.label}</div>
            <div className="mb-2"><b>Scope of Work:</b> {scope}</div>
            <div className="mb-2"><b>Materials:</b> {materials === 'client' ? 'Client' : 'Worker'}</div>
            <div className="mb-2"><b>Timeline:</b> {startDate} to {endDate}</div>
            <div className="mb-2"><b>Payment Terms:</b> R{cost} - {paymentSchedules.find(s => s.value === schedule)?.label} ({paymentMethods.find(m => m.value === method)?.label})</div>
          </div>
          <div className="mb-4 text-muted-foreground">Both parties must review and sign this agreement. Your signature will be timestamped and recorded.</div>
          <Button className="mr-2" variant="outline" onClick={() => setReview(false)}>Edit</Button>
          <Button onClick={handleSign}><Handshake className="mr-2 h-4 w-4" /> I Agree & Sign</Button>
        </div>
      );
    }

    return (
      <form className="space-y-6 animate-fade-in" onSubmit={e => { e.preventDefault(); handleReview(); }}>
        <div>
          <label className="block font-semibold mb-1">Template</label>
          <Select value={template} onValueChange={setTemplate}>
            {agreementTemplates.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </Select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Scope of Work</label>
          <Textarea value={scope} onChange={e => setScope(e.target.value)} placeholder="Describe the tasks to be completed..." required />
        </div>
        <div>
          <label className="block font-semibold mb-1">Materials</label>
          <div className="flex gap-4">
            <label><input type="radio" checked={materials === 'client'} onChange={() => setMaterials('client')} /> Client</label>
            <label><input type="radio" checked={materials === 'worker'} onChange={() => setMaterials('worker')} /> Worker</label>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-semibold mb-1">Start Date</label>
            <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1">End Date</label>
            <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-semibold mb-1">Total Cost (R)</label>
            <Input type="number" value={cost} onChange={e => setCost(e.target.value)} required min={0} />
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1">Payment Schedule</label>
            <Select value={schedule} onValueChange={setSchedule}>
              {paymentSchedules.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </Select>
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1">Payment Method</label>
            <Select value={method} onValueChange={setMethod}>
              {paymentMethods.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="submit" className="mt-4"><FileIcon className="mr-2 h-4 w-4" /> Review Agreement</Button>
        </div>
      </form>
    );
  }

  function DisputeChat() {
    const [messages, setMessages] = useState([
      { sender: 'worker', text: 'I completed the work as agreed.', time: '09:00', type: 'text' },
      { sender: 'client', text: 'The faucet is still leaking.', time: '09:01', type: 'text' },
      { sender: 'admin', text: 'Please upload photos of the work and any relevant messages.', time: '09:02', type: 'text' },
    ]);
    const [input, setInput] = useState('');
    const [attachments, setAttachments] = useState([]);
    const [resolution, setResolution] = useState('');
    const [status, setStatus] = useState('open');

    const handleSend = () => {
      if (input.trim()) {
        setMessages([...messages, { sender: 'worker', text: input, time: '09:10', type: 'text' }]);
        setInput('');
      }
    };
    const handleAttach = (e) => {
      if (e.target.files && e.target.files[0]) {
        setAttachments([...attachments, e.target.files[0].name]);
        setMessages([...messages, { sender: 'worker', text: e.target.files[0].name, time: '09:11', type: 'file' }]);
      }
    };
    const handleResolution = () => {
      setResolution('Admin recommends a partial refund and a follow-up visit.');
      setStatus('resolved');
    };

    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="h-5 w-5 text-blue-600" />
          <span className="font-semibold text-lg">Dispute Chat</span>
          <span className={`ml-auto px-2 py-1 rounded text-xs ${status === 'open' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{status === 'open' ? 'Open' : 'Resolved'}</span>
        </div>
        <div className="bg-gray-50 border rounded p-4 h-72 overflow-y-auto mb-4 flex flex-col gap-2">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === 'worker' ? 'justify-start' : msg.sender === 'client' ? 'justify-end' : 'justify-center'}`}>
              <div className={`rounded-lg px-3 py-2 max-w-xs shadow-sm ${msg.sender === 'admin' ? 'bg-blue-100 text-blue-900' : msg.sender === 'worker' ? 'bg-green-100 text-green-900' : 'bg-yellow-100 text-yellow-900'}`}>
                <div className="flex items-center gap-1 mb-1">
                  {msg.sender === 'worker' && <UserCheck className="h-3 w-3" />}
                  {msg.sender === 'client' && <UserX className="h-3 w-3" />}
                  {msg.sender === 'admin' && <Shield className="h-3 w-3" />}
                  <span className="text-xs font-semibold capitalize">{msg.sender}</span>
                  <span className="ml-2 text-xs text-gray-400">{msg.time}</span>
                </div>
                {msg.type === 'file' ? (
                  <div className="flex items-center gap-2 text-blue-700"><ImageIcon className="h-4 w-4" /> {msg.text}</div>
                ) : (
                  <div>{msg.text}</div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mb-4">
          <input type="file" id="attach" className="hidden" onChange={handleAttach} />
          <label htmlFor="attach" className="cursor-pointer"><Paperclip className="h-5 w-5 text-blue-600" /></label>
          <input
            className="flex-1 border rounded px-3 py-2"
            placeholder="Type your message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <Button onClick={handleSend} variant="secondary"><Send className="h-4 w-4" /></Button>
        </div>
        <div className="mb-4">
          <div className="font-semibold mb-1">Resolution Tracker</div>
          <div className="flex items-center gap-2">
            <div className={`h-2 w-24 rounded-full ${status === 'open' ? 'bg-yellow-400' : 'bg-green-600'} transition-all`} />
            <div className="text-xs">{status === 'open' ? 'Awaiting Admin Recommendation' : 'Resolved'}</div>
          </div>
        </div>
        {status === 'open' && (
          <div className="mb-4 text-center">
            <Button onClick={handleResolution} variant="outline"><Shield className="mr-2 h-4 w-4" /> Admin: Provide Recommendation</Button>
          </div>
        )}
        {resolution && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded mt-4 animate-fade-in">
            <div className="font-semibold mb-1">Admin Recommendation</div>
            <div>{resolution}</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600 animate-pulse" />
            TrustLock Agreement System
            <span className="ml-auto">{getStatusBadge()}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="verification">Verification</TabsTrigger>
              <TabsTrigger value="agreement">Agreement</TabsTrigger>
              <TabsTrigger value="dispute">Dispute Resolution</TabsTrigger>
            </TabsList>
            <TabsContent value="verification">
              <div className="py-6">
                <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" /> Become Gigstr Verified
                </h2>
                <div className="mb-4 flex items-center gap-4">
                  <div className={`h-2 w-24 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'} transition-all`} />
                  <div className={`h-2 w-24 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'} transition-all`} />
                  <div className={`h-2 w-24 rounded-full ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'} transition-all`} />
                </div>
                <div className="mb-4 text-muted-foreground">Upload your documents securely to earn the TrustLock Verified badge. All documents are encrypted and only visible to Gigstr admins for verification.</div>
                {step === 1 && (
                  <div className="mb-6 animate-fade-in">
                    <h3 className="font-semibold mb-2">Step 1: Upload ID</h3>
                    <input type="file" accept="image/*,application/pdf" onChange={e => e.target.files && handleUpload('id', e.target.files[0])} />
                    {uploadedDocs.id && <div className="mt-2 text-green-700">Uploaded: {uploadedDocs.id}</div>}
                    <Button className="mt-4" onClick={() => setStep(2)} disabled={!uploadedDocs.id}>Next</Button>
                  </div>
                )}
                {step === 2 && (
                  <div className="mb-6 animate-fade-in">
                    <h3 className="font-semibold mb-2">Step 2: Upload Proof of Address</h3>
                    <input type="file" accept="image/*,application/pdf" onChange={e => e.target.files && handleUpload('address', e.target.files[0])} />
                    {uploadedDocs.address && <div className="mt-2 text-green-700">Uploaded: {uploadedDocs.address}</div>}
                    <Button className="mt-4 mr-2" variant="outline" onClick={() => setStep(1)}>Back</Button>
                    <Button className="mt-4" onClick={() => setStep(3)} disabled={!uploadedDocs.address}>Next</Button>
                  </div>
                )}
                {step === 3 && (
                  <div className="mb-6 animate-fade-in">
                    <h3 className="font-semibold mb-2">Step 3: Upload Certifications (Optional)</h3>
                    <input type="file" accept="image/*,application/pdf" onChange={e => e.target.files && handleUpload('cert', e.target.files[0])} />
                    {uploadedDocs.cert && <div className="mt-2 text-green-700">Uploaded: {uploadedDocs.cert}</div>}
                    <Button className="mt-4 mr-2" variant="outline" onClick={() => setStep(2)}>Back</Button>
                    <Button className="mt-4" onClick={() => setStep(4)}>Submit for Review</Button>
                  </div>
                )}
                {step === 4 && (
                  <div className="mb-6 animate-fade-in text-center">
                    <Shield className="h-8 w-8 text-blue-600 mx-auto animate-bounce" />
                    <div className="font-semibold text-blue-700 mt-2">Documents Submitted!</div>
                    <div className="text-muted-foreground mt-2">Your documents are under review. You’ll be notified once your verification is complete.</div>
                  </div>
                )}
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded mt-6">
                  <span className="font-medium">Privacy:</span> Your documents are encrypted and only accessible to Gigstr admins for verification. They are deleted after review.
                </div>
              </div>
            </TabsContent>
            <TabsContent value="agreement">
              <div className="py-6">
                <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                  <FileIcon className="h-5 w-5 text-blue-600" /> Create a TrustLock Agreement
                </h2>
                <div className="mb-4 text-muted-foreground">Use this guided form to create a clear, formal agreement for your job. Both parties must review and sign before work begins.</div>
                <AgreementForm />
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded mt-6">
                  <span className="font-medium">Note:</span> Gigstr provides this tool to help formalize agreements. It is not a substitute for independent legal advice. Gigstr is not a party to this agreement and is not responsible for its enforcement.
                </div>
              </div>
            </TabsContent>
            <TabsContent value="dispute">
              <div className="py-6">
                <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                  <Gavel className="h-5 w-5 text-blue-600" /> Dispute Resolution Center
                </h2>
                <div className="mb-4 text-muted-foreground">You are now in a private chat with the other party and Gigstr Support. Please provide all relevant information and evidence to help us mediate.</div>
                <DisputeChat />
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded mt-6">
                  <span className="font-medium">Disclaimer:</span> Gigstr provides this tool to help formalize agreements. It is not a substitute for independent legal advice. Gigstr is not a party to this agreement and is not responsible for its enforcement.
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrustLock; 