import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const roadmap = {
  "Phase 1: Foundation Setup (Week 1-2)": {
    "LinkedIn Setup (Day 1)": [
      "Create Business page: 'AURA-BREE Healthcare AI'",
      "Set Category: 'Software Development' → 'Healthcare Technology'",
      "Set Location: Russell, Ontario, Canada",
      "Link Website: methaclinic-training.netlify.app",
      "Optimize Cover Image: Healthcare professionals using AI interface",
      "Optimize Logo: AURA-BREE branding consistent across platforms",
      "Optimize About Section: 'Sovereign healthcare AI that puts patients first. 24/7 therapeutic companions, crisis prevention, complete data privacy.'",
      "Add Services: Healthcare AI, EMR Systems, Staff Training, Crisis Prevention",
      "Set Contact Info: james@godsimij-ai-solutions.com",
      "Initial Content: Post company update, 'Why Healthcare AI Must Serve Patients, Not Profits' article, and a case study teaser.",
    ],
    "Twitter/X Setup (Day 2)": [
      "Set Handle: @AuraBreeAI (or closest available)",
      "Set Display Name: 'AURA-BREE Healthcare AI'",
      "Set Bio: '24/7 therapeutic AI companions | Crisis prevention | Patient data sovereignty | Healthcare professionals: See what's possible'",
      "Set Location: Ontario, Canada",
      "Pin Tweet: 'Healthcare AI should prevent crises, not just track billing codes...'",
      "Plan Thread Series: 'Healthcare AI Reality Check'",
      "Follow Strategy: Healthcare innovation accounts, EMR critics, patient advocacy groups, AI researchers.",
    ],
    "Facebook Setup (Day 3)": [
      "Create Business Page: 'AURA-BREE Healthcare AI'",
      "Create Community Group: 'Healthcare AI Sovereignty Movement'",
      "Optimize Page: Add cover video, 'Contact Us' button, and services.",
    ],
    "Instagram Setup (Day 4)": [
      "Configure Business Account linked to Facebook",
      "Set Bio: 'Healthcare AI that serves patients first...'",
      "Plan Content: Setup Story highlights and plan first 9 posts.",
    ],
    "Discord Server Setup (Day 5)": [
      "Structure Server: Create categories and channels",
      "Setup Roles: @Healthcare Professional, @Developer, etc.",
      "Define Verification Process for roles.",
    ],
  },
  "Phase 2: Content Development (Week 3-4)": {
    "Content Workflow": [
      "Monday: Case study or success story",
      "Tuesday: Technical feature explanation",
      "Wednesday: Healthcare industry insight",
      "Thursday: Patient advocacy content",
      "Friday: Team/behind-the-scenes content",
      "Weekend: Community engagement",
    ],
    "Platform Specific Content": [
      "LinkedIn: Industry analysis, infographics, testimonials",
      "Twitter/X: Daily insights, threads, live-tweeting",
      "Facebook: Discussion prompts, Live Q&As, polls",
      "Instagram: Behind-the-scenes, infographics, video demos",
      "Discord: Weekly calls, AMAs, beta testing coordination",
    ],
  },
  "Phase 3: Community Building (Week 5-8)": {
    "Audience Acquisition": [
      "LinkedIn: Connect with clinic admins, IT pros, EMR critics. Comment on posts and share in groups.",
      "Twitter/X: Participate in #HealthIT chats. Reply to pain points. Use strategic hashtags.",
      "Facebook: Cross-post to group, invite connections, host virtual events.",
      "Instagram: Use relevant hashtags, engage with healthcare accounts, create shareable content.",
      "Discord: Invite followers, host exclusive events, provide direct team access.",
    ],
  },
  "Phase 4: Engagement Optimization (Week 9-12)": {
    "Daily Schedule (2-3 hours)": [
      "Morning (30 mins): Check notifications, respond, schedule posts.",
      "Midday (15 mins): Engage with followers' content, share news.",
      "Evening (30 mins): Review metrics, plan next day's content.",
    ],
    "Platform Engagement Strategies": [
      "LinkedIn: Comment on 5-10 posts, send 10 personalized requests daily.",
      "Twitter/X: Join conversations, reply to tweets about system frustrations.",
      "Facebook: Host monthly live Q&A, post discussion prompts.",
      "Instagram: Use stories for real-time updates, host live demos.",
      "Discord: Daily check-ins, weekly community calls, immediate responses.",
    ],
  },
  "Phase 5: Growth Acceleration (Month 4+)": {
    "Advanced Strategies": [
      "Content Partnerships: Guest posts, podcast appearances, webinars.",
      "Community Leadership: Establish thought leadership, create whitepapers, host summits.",
      "Conversion Optimization: Track metrics, A/B test CTAs, create landing pages.",
    ],
    "Success Metrics (6 months)": [
      "LinkedIn: 5,000 followers",
      "Twitter: 10,000 followers",
      "Facebook: 3,000 likes",
      "Instagram: 5,000 followers",
      "Discord: 200 active members",
      "Qualitative: Inbound demo requests, media mentions, speaking opportunities.",
    ],
  },
};

const TaskItem = ({ task }: { task: string }) => (
    <div className="flex items-start space-x-3 py-1.5">
      <Checkbox id={task} className="mt-1" />
      <Label htmlFor={task} className="text-sm font-normal text-foreground/90 leading-snug">
        {task}
      </Label>
    </div>
  );

export function RoadmapProgress() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AURA-BREE Rollout Roadmap</CardTitle>
        <CardDescription>Your zero-budget, maximum impact strategy.</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {Object.entries(roadmap).map(([phase, sections], phaseIndex) => (
            <AccordionItem value={`phase-${phaseIndex}`} key={phase}>
              <AccordionTrigger>{phase}</AccordionTrigger>
              <AccordionContent>
                <Accordion type="multiple" className="w-full space-y-2 pl-4">
                  {Object.entries(sections).map(([section, tasks], sectionIndex) => (
                    <AccordionItem value={`section-${phaseIndex}-${sectionIndex}`} key={section}>
                       <AccordionTrigger className="text-base py-3">{section}</AccordionTrigger>
                       <AccordionContent className="pt-2 pl-4 border-l">
                        {tasks.map((task) => (
                            <TaskItem key={task} task={task} />
                        ))}
                       </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
