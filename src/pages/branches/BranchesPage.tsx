import { PageShell } from '@/components/shared/PageShell'
import { GitBranch } from 'lucide-react'

export function BranchesPage() {
  return <PageShell titleKey="nav.branches" icon={GitBranch} />
}
