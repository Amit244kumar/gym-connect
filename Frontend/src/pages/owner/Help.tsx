// src/pages/HelpPage.tsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  HelpCircle,
  Search,
  BookOpen,
  MessageSquare,
  Phone,
  Mail,
  ChevronRight,
  Plus,
  FileText,
  Video,
  Users,
} from "lucide-react";
import { toast } from "sonner";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  expanded: boolean;
}

interface Guide {
  id: number;
  title: string;
  description: string;
  category: string;
  icon: any;
}

interface ContactMethod {
  id: number;
  title: string;
  description: string;
  icon: any;
  action: string;
}

const Help = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [faqs, setFaqs] = useState<FAQItem[]>([
    {
      id: 1,
      question: "How do I reset my password?",
      answer: "To reset your password, click on the 'Forgot Password' link on the login page. Enter your email address and follow the instructions sent to your inbox.",
      category: "account",
      expanded: false,
    },
    {
      id: 2,
      question: "How can I upgrade my membership plan?",
      answer: "You can upgrade your membership plan by going to the 'Membership' section in your account settings. Select the plan you want to upgrade to and follow the payment process.",
      category: "billing",
      expanded: false,
    },
    {
      id: 3,
      question: "What is included in the Premium membership?",
      answer: "The Premium membership includes full gym access, unlimited group classes, 2 personal trainer sessions per month, advanced nutrition plan, and 2 guest passes per month.",
      category: "membership",
      expanded: false,
    },
    {
      id: 4,
      question: "How do I cancel my membership?",
      answer: "To cancel your membership, go to the 'Billing' section in your account settings. Click on 'Cancel Plan' and follow the confirmation process. Note that cancellations take effect at the end of your current billing period.",
      category: "billing",
      expanded: false,
    },
  ]);

  const guides: Guide[] = [
    {
      id: 1,
      title: "Getting Started",
      description: "Learn how to set up your account and navigate the dashboard",
      category: "basics",
      icon: BookOpen,
    },
    {
      id: 2,
      title: "Managing Members",
      description: "Add, edit, and manage gym member profiles",
      category: "management",
      icon: Users,
    },
    {
      id: 3,
      title: "Payment Processing",
      description: "Set up payment methods and handle billing",
      category: "billing",
      icon: FileText,
    },
    {
      id: 4,
      title: "Generating Reports",
      description: "Create and analyze gym performance reports",
      category: "analytics",
      icon: Video,
    },
  ];

  const contactMethods: ContactMethod[] = [
    {
      id: 1,
      title: "Help Center",
      description: "Browse our comprehensive knowledge base",
      icon: BookOpen,
      action: "Browse Articles",
    },
    {
      id: 2,
      title: "Live Chat",
      description: "Chat with our support team in real-time",
      icon: MessageSquare,
      action: "Start Chat",
    },
    {
      id: 3,
      title: "Email Support",
      description: "Send us an email and we'll respond within 24 hours",
      icon: Mail,
      action: "Send Email",
    },
    {
      id: 4,
      title: "Phone Support",
      description: "Call us for immediate assistance",
      icon: Phone,
      action: "Call Now",
    },
  ];

  const toggleFAQ = (id: number) => {
    setFaqs(faqs.map(faq => 
      faq.id === id ? { ...faq, expanded: !faq.expanded } : { ...faq, expanded: false }
    ));
  };

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContact = (method: string) => {
    toast.info(`Opening ${method}...`);
  };

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Help & Support</h1>
          <p className="text-slate-400">Find answers to your questions or get in touch with our support team</p>
        </div>

        <Tabs defaultValue="faq" className="space-y-6">
          <TabsList className="bg-slate-800/50 border-slate-700">
            <TabsTrigger value="faq" className="text-slate-300 hover:text-white">
              <HelpCircle className="h-4 w-4 mr-2" />
              FAQ
            </TabsTrigger>
            <TabsTrigger value="guides" className="text-slate-300 hover:text-white">
              <BookOpen className="h-4 w-4 mr-2" />
              Guides
            </TabsTrigger>
            <TabsTrigger value="contact" className="text-slate-300 hover:text-white">
              <MessageSquare className="h-4 w-4 mr-2" />
              Contact
            </TabsTrigger>
          </TabsList>

          <TabsContent value="faq">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Frequently Asked Questions</CardTitle>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Search FAQs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {filteredFAQs.length > 0 ? (
                  <div className="space-y-4">
                    {filteredFAQs.map((faq) => (
                      <Card key={faq.id} className="bg-slate-700/50 border-slate-600">
                        <CardContent className="p-4">
                          <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleFAQ(faq.id)}
                          >
                            <h3 className="font-medium text-white">{faq.question}</h3>
                            <ChevronRight
                              className={`h-5 w-5 text-slate-400 transition-transform ${
                                faq.expanded ? "rotate-90" : ""
                              }`}
                            />
                          </div>
                          {faq.expanded && (
                            <div className="mt-3 pt-3 border-t border-slate-600">
                              <p className="text-slate-300">{faq.answer}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <HelpCircle className="h-16 w-16 text-slate-400 mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No results found</h3>
                    <p className="text-slate-400 text-center max-w-md">
                      We couldn't find any FAQs matching your search. Try different keywords or browse all categories.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guides">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {guides.map((guide) => (
                <Card key={guide.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-colors cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 rounded-lg bg-orange-500/20">
                        <guide.icon className="h-6 w-6 text-orange-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-white mb-1">{guide.title}</h3>
                        <p className="text-slate-300 mb-3">{guide.description}</p>
                        <Badge className="bg-slate-700 text-slate-300">
                          {guide.category}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="contact">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contactMethods.map((method) => (
                <Card key={method.id} className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 rounded-lg bg-blue-500/20">
                        <method.icon className="h-6 w-6 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-white mb-1">{method.title}</h3>
                        <p className="text-slate-300 mb-4">{method.description}</p>
                        <Button
                          onClick={() => handleContact(method.title)}
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          {method.action}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-slate-800/50 border-slate-700 mt-6">
              <CardHeader>
                <CardTitle className="text-white">Submit a Request</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Subject</label>
                    <Input
                      placeholder="What do you need help with?"
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Category</label>
                    <select className="w-full bg-slate-700/50 border-slate-600 text-white rounded-md px-3 py-2">
                      <option value="">Select a category</option>
                      <option value="account">Account Issues</option>
                      <option value="billing">Billing & Payments</option>
                      <option value="membership">Membership Questions</option>
                      <option value="technical">Technical Support</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Description</label>
                  <textarea
                    placeholder="Please provide as much detail as possible"
                    rows={4}
                    className="w-full bg-slate-700/50 border-slate-600 text-white rounded-md px-3 py-2"
                  ></textarea>
                </div>
                <div className="flex justify-end">
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Submit Request
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  );
};

export default Help;