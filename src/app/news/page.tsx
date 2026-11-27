import type { Metadata } from "next";
export const metadata: Metadata = {"title": "News From Tano | Tano", "description": "Announcements from the Tano team, starting with our seed round led by Cherry Ventures."};

import { NewsReplica } from "../../components/sites/tano/replica/NewsReplica";

export default function Page() {
  return <NewsReplica />;
}
