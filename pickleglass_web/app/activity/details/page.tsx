'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRedirectIfNotAuth } from '@/utils/auth'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  UserProfile,
  SessionDetails,
  Transcript,
  AiMessage,
  getSessionDetails,
} from '@/utils/api'

type ConversationItem = (Transcript & { type: 'transcript' }) | (AiMessage & { type: 'ai_message' });

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">{title}</h2>
        <div className="text-gray-700 space-y-2">
            {children}
        </div>
    </div>
);

function SessionDetailsContent() {
  const userInfo = useRedirectIfNotAuth() as UserProfile | null;
  const [sessionDetails, setSessionDetails] = useState<SessionDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');

  useEffect(() => {
    if (userInfo && sessionId) {
      const fetchDetails = async () => {
        setIsLoading(true);
        try {
          const details = await getSessionDetails(sessionId as string);
          setSessionDetails(details);
        } catch (error) {
          console.error('Failed to load session details:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchDetails();
    }
  }, [userInfo, sessionId]);

  if (!userInfo || isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFCF9] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading session details...</p>
        </div>
      </div>
    );
  }

  if (!sessionDetails) {
    return (
        <div className="min-h-screen bg-[#FDFCF9] flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-8 py-12 text-center">
                <h2 className="text-2xl font-semibold text-gray-900 mb-8">Session Not Found</h2>
                <p className="text-gray-600">The requested session could not be found.</p>
                                    <Link href="/activity" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
                        &larr; Back to Activity
                    </Link>
            </div>
        </div>
    )
  }
  
  const combinedConversation = [
    ...sessionDetails.transcripts.map(t => ({ ...t, type: 'transcript' as const, created_at: t.start_at })),
    ...sessionDetails.ai_messages.map(m => ({ ...m, type: 'ai_message' as const, created_at: m.sent_at }))
  ].sort((a, b) => (a.created_at || 0) - (b.created_at || 0));

  const audioTranscripts = sessionDetails.transcripts.filter(t => t.speaker !== 'Me');

  return (
    <div className="min-h-screen bg-[#FDFCF9] text-gray-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
                <Link href="/activity" className="text-sm text-gray-500 hover:text-gray-700 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </Link>
            </div>

            <div className="bg-white p-8 rounded-xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {sessionDetails.session.title || `Conversation on ${new Date(sessionDetails.session.started_at * 1000).toLocaleDateString()}`}
                    </h1>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <span>{new Date(sessionDetails.session.started_at * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        <span>{new Date(sessionDetails.session.started_at * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</span>
                    </div>
                </div>

                {sessionDetails.summary && (
                    <Section title="Summary">
                        <p className="italic">"{sessionDetails.summary.tldr}"</p>
                    </Section>
                )}
                
                <Section title="Notes">
                    {combinedConversation.map((item) => (
                        <p key={item.id}>
                            <span className="font-semibold">{(item.type === 'transcript' && item.speaker === 'Me') || (item.type === 'ai_message' && item.role === 'user') ? 'You: ' : 'AI: '}</span>
                            {item.type === 'transcript' ? item.text : item.content}
                        </p>
                    ))}
                    {combinedConversation.length === 0 && <p>No notes recorded for this session.</p>}
                </Section>
                
                <Section title="Audio transcript content">
                    {audioTranscripts.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1">
                            {audioTranscripts.map(t => <li key={t.id}>{t.text}</li>)}
                        </ul>
                    ) : (
                        <p>No audio transcript available for this session.</p>
                    )}
                </Section>
            </div>
        </div>
    </div>
  );
}

export default function SessionDetailsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FDFCF9] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SessionDetailsContent />
    </Suspense>
  );
} 