import KeywordStatsClientComponent from "./client";
import { getKeywordStats } from "../server-actions/statistics/get-keywords-stats";

export default async function StatisticsPage() {
  const keywordStats = await getKeywordStats();

  return (
    <div className="px-10 py-20">
      <h1 className="text-2xl text-rose-500 mb-5">Statistiques</h1>

      <KeywordStatsClientComponent keywordStats={keywordStats} />
    </div>
  );
}
