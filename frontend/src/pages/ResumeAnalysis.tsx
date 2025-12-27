import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Loader2,
  Upload,
  FileText,
  Briefcase,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Lightbulb,
  Sparkles,
  ArrowRight,
  BookOpen,
  Target,
  RefreshCw,
} from 'lucide-react';
import {
  analyzeResume,
  refineResume,
  fetchRecommendations,
  uploadResume,
} from '@/services/resumeService';
import { useNavigate } from 'react-router-dom';

const ResumeAnalysis = () => {
  const { user, setResumeText: saveResumeToContext } = useAuth();
  const navigate = useNavigate();

  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  // Refinement state
  const [refinementInput, setRefinementInput] = useState('');
  const [refinedResume, setRefinedResume] = useState('');

  useEffect(() => {
    // Load existing resume text if available
    if (user?.resumeText) {
      setResumeText(user.resumeText);
    }
  }, [user]);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResumeFile(file);
    setIsUploading(true);

    try {
      const text = await uploadResumeFile(file);
      setResumeText(text);
      saveResumeToContext(text);
    } catch (error) {
      console.error('Upload failed:', error);
      // You might want to show a toast error here
    } finally {
      setIsUploading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText || !jobDescription) return;

    setIsAnalyzing(true);
    try {
      // 1. Analyze Resume
      const analysisData = await analyzeResume(resumeText, jobDescription);

      // 2. Fetch Recommendations based on skills
      const recs = await fetchRecommendations({
        skills: analysisData.matchedSkills,
        missingSkills: analysisData.missingSkills
      });

      setResult({
        ...analysisData,
        recommendations: recs
      });
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRefine = async () => {
    if (!resumeText || !refinementInput) return;

    setIsRefining(true);
    try {
      const newText = await refineResume(resumeText, refinementInput);
      setRefinedResume(newText);
      // Optionally update the main resume text
      // setResumeText(newText);
      // saveResumeToContext(newText);
    } catch (error) {
      console.error('Refinement failed:', error);
    } finally {
      setIsRefining(false);
    }
  };

  const resetAnalysis = () => {
    setResult(null);
    setJobDescription('');
    // We keep the resume text as the user might want to check against another job
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-8">
        <Button variant="ghost" onClick={() => navigate('/home')} className="mb-6">
          ← Back to Home
        </Button>

        <div className="flex items-center gap-3 mb-8">
          <FileText className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">AI-Powered Resume Analysis</h1>
        </div>

        {!result ? (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              {/* Resume Input */}
              <Card className="border-border/60 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5 text-primary" />
                    Your Resume
                  </CardTitle>
                  <CardDescription>
                    Paste your resume text or upload a PDF/Image
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={handleResumeUpload}
                        disabled={isUploading}
                      />
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors ${isUploading ? 'opacity-50' : ''}`}>
                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        <span className="text-sm font-medium">Upload File</span>
                      </div>
                    </label>
                    {resumeFile && (
                      <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {resumeFile.name}
                      </span>
                    )}
                  </div>

                  <Textarea
                    placeholder="Paste your resume content here..."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    className="min-h-[300px] font-mono text-sm resize-none focus-visible:ring-primary"
                    disabled={isUploading}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Job Description Input */}
              <Card className="border-border/60 shadow-sm h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    Job Description
                  </CardTitle>
                  <CardDescription>
                    Paste the job description you want to apply for
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <Textarea
                    placeholder="Paste job requirements and description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="min-h-[300px] h-full font-mono text-sm resize-none focus-visible:ring-primary"
                  />
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full text-lg h-12"
                    onClick={handleAnalyze}
                    disabled={!resumeText.trim() || !jobDescription.trim() || isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Analyze Match
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Results Header */}
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-stretch">
              {/* Match Score Card */}
              <Card className="flex-1 border-primary/20 bg-primary/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <Target className="w-24 h-24 text-primary" />
                </div>
                <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" /> Match Score
                  </h2>
                  <div className={`text-6xl font-black mb-2 tracking-tighter ${getMatchColor(result.matchPercentage)}`}>
                    {result.matchPercentage}%
                  </div>
                  <Progress value={result.matchPercentage} className="h-2 w-full max-w-[200px] mb-4" />
                  <p className="text-sm text-muted-foreground font-medium max-w-xs">
                    {result.matchPercentage >= 80
                      ? "Excellent fit! Your profile strongly matches the requirements."
                      : result.matchPercentage >= 60
                        ? "Good match. Address the missing skills to improve your odds."
                        : "Low match. Consider gaining more relevant experience."}
                  </p>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="flex-[2] grid sm:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2 text-green-700">
                      <CheckCircle2 className="w-5 h-5" /> Matched Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {result.matchedSkills.map((skill: string, i: number) => (
                        <Badge key={i} variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
                          {skill}
                        </Badge>
                      ))}
                      {result.matchedSkills.length === 0 && <span className="text-sm text-muted-foreground">No direct matches found.</span>}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2 text-red-700">
                      <XCircle className="w-5 h-5" /> Missing Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {result.missingSkills.map((skill: string, i: number) => (
                        <Badge key={i} variant="outline" className="border-red-200 text-red-700 bg-red-50">
                          {skill}
                        </Badge>
                      ))}
                      {result.missingSkills.length === 0 && <span className="text-sm text-muted-foreground">No missing skills identified!</span>}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="grid md:grid-cols-7 gap-8">
              {/* Left Column: Analysis Details */}
              <div className="md:col-span-4 space-y-6">

                {/* Strengths & Weaknesses */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600" /> Key Strengths
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.strengths?.map((item: string, i: number) => (
                          <li key={i} className="text-sm flex items-start gap-2 text-muted-foreground">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-yellow-600" /> Improvement Areas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.weaknesses?.map((item: string, i: number) => (
                          <li key={i} className="text-sm flex items-start gap-2 text-muted-foreground">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* AI Suggestions */}
                <Card className="border-primary/20 bg-accent/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" /> AI Action Plan
                    </CardTitle>
                    <CardDescription>Tailored suggestions to improve your match score</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-muted-foreground" /> Recommended Learning
                      </h4>
                      <div className="space-y-2">
                        {result.suggestions?.skills?.map((item: string, i: number) => (
                          <div key={i} className="bg-background p-3 rounded-md text-sm border flex items-start gap-3">
                            <ArrowRight className="w-4 h-4 text-primary mt-0.5" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-muted-foreground" /> Project Ideas
                      </h4>
                      <div className="space-y-2">
                        {result.suggestions?.projects?.map((item: string, i: number) => (
                          <div key={i} className="bg-background p-3 rounded-md text-sm border flex items-start gap-3">
                            <ArrowRight className="w-4 h-4 text-primary mt-0.5" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Refine & Opportunities */}
              <div className="md:col-span-3 space-y-6">

                {/* Refine Resume Section */}
                <Card className="border-2 border-primary/10 shadow-md">
                  <CardHeader className="bg-primary/5">
                    <CardTitle className="flex items-center gap-2 text-primary-dark">
                      <RefreshCw className="w-5 h-5" /> Refine with AI
                    </CardTitle>
                    <CardDescription>
                      Provide extra details and let AI rewrite your resume to better match this job.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                      <Label>Additional Context / Missing Details</Label>
                      <Textarea
                        placeholder="e.g., 'I actually have experience with MongoDB from a hackathon project defined as...'"
                        value={refinementInput}
                        onChange={(e) => setRefinementInput(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>

                    {refinedResume && (
                      <div className="space-y-2">
                        <Label className="text-green-600 font-semibold flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" /> Refined Version
                        </Label>
                        <Textarea
                          value={refinedResume}
                          readOnly
                          className="min-h-[200px] bg-muted/30 font-mono text-xs"
                        />
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full"
                          onClick={() => {
                            setResumeText(refinedResume);
                            setRefinedResume('');
                            setRefinementInput('');
                            saveResumeToContext(refinedResume);
                          }}
                        >
                          Use This Version
                        </Button>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={handleRefine}
                      disabled={isRefining || !refinementInput}
                    >
                      {isRefining ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Refining...</>) : 'Refine Resume'}
                    </Button>
                  </CardFooter>
                </Card>

                {/* Recommended Opportunities */}
                {result.recommendations?.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Similar Opportunities</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {result.recommendations.map((opp: any) => (
                        <div key={opp.id} className="p-3 rounded-lg border hover:border-primary/50 transition-all cursor-pointer group bg-card">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-1">{opp.title}</h4>
                            <Badge variant="outline" className="text-[10px] h-5">{opp.matchPercentage}%</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{opp.organization}</p>
                          <div className="flex flex-wrap gap-1">
                            {opp.domains?.slice(0, 2).map((d: string) => (
                              <span key={d} className="text-[10px] px-1.5 py-0.5 bg-secondary rounded-sm text-secondary-foreground">
                                {d}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            <div className="flex gap-4 justify-center pt-8 border-t">
              <Button variant="outline" size="lg" onClick={resetAnalysis}>
                Analyze Another Job
              </Button>
              <Button size="lg" onClick={() => navigate('/home')}>
                Browse Opportunities
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ResumeAnalysis;