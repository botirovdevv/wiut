import { Suspense } from "react";
import JobView from "@/components/JobView";
import JobProgress from "@/components/JobProgress";

export default function JobPage() {
  return (
    <Suspense fallback={<JobProgress status={{ status: "queued", progress: 0 }} />}>
      <JobView />
    </Suspense>
  );
}
