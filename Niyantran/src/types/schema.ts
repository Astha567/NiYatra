export type Department = 'ENG' | 'SNT' | 'TRD';
export type Severity = 'critical' | 'major' | 'minor';
export type BlockType = 'traffic_block' | 'power_block' | 'both';
export type AssetCriticality = 'high' | 'medium' | 'low';
export type TrainType = 'passenger' | 'freight';
export type BlockStatus = 'pending_review' | 'approved' | 'customized' | 'rejected';
export type OfficerAction = 'approve' | 'reject' | 'remove_task' | 'retime_task';
export type ConflictResolution = 'merged' | 'pending';

export interface MaintenanceTask {
  task_id: string;
  department: Department;
  section_id: string;
  chainage_start_km: number;
  chainage_end_km: number;
  defect_type: string;
  severity: Severity;
  overdue_days: number;
  estimated_block_minutes: number;
  block_type: BlockType;
  asset_criticality: AssetCriticality;
  priority_score: number; // 0-100
  criticality_score: number;
  urgency_score: number;
  network_impact_score: number;
  recommended_block_slot: string;
  queue_status?: 'pending' | 'sent_to_scheduler' | 'flagged_for_review';
  queue_note?: string;
  action_by?: string;
}

export interface CorridorBusySlot {
  section_id: string;
  day: string;
  start_time: string;
  end_time: string;
  train_type: TrainType;
  train_id: string;
}

export interface OfficerDecision {
  decided_by?: string;
  action: OfficerAction;
  target_task_id?: string;
  new_start_time?: string;
  comment?: string;
}

export interface ScheduledBlock {
  block_id: string;
  section_id: string;
  day: string;
  week_number: number; // 1-4
  start_time: string;
  end_time: string;
  tasks: MaintenanceTask[];
  departments_involved: Department[];
  is_merged: boolean;
  total_priority_score: number;
  reasoning: string;
  status: BlockStatus;
  is_customizable: boolean;
  customizable_task_ids: string[];
  officer_decision?: OfficerDecision;
}

export interface Conflict {
  section_id: string;
  day: string;
  week_number: number;
  overlapping_tasks: MaintenanceTask[];
  resolution: ConflictResolution;
  reasoning: string;
}

export interface WeeklyPlan {
  week_number: number;
  week_start: string;
  scheduled_blocks: ScheduledBlock[];
  unscheduled_tasks: MaintenanceTask[];
  unscheduled_reason: Record<string, string>;
}

export interface SectionSummary {
  section_id: string;
  blocks_planned: number;
  backlog_cleared: number;
  backlog_remaining: number;
}

export interface MonthlyPlan {
  month: string;
  weeks: WeeklyPlan[];
  section_summary: SectionSummary[];
  generated_at: string;
}

// Stage 1 Additions for DRM Division Overview & Inter-Corridor Contention
export interface CorridorMetrics {
  corridor_id: string;
  corridor_name: string;
  division: string;
  asset_availability_pct: number;
  overdue_defects_count: number;
  pending_blocks_count: number;
  approved_blocks_count: number;
  downtime_trend_pct: number; // e.g. -4.2% or +1.5%
  critical_defects_count: number;
  active_sections: number;
}

export interface CrossCorridorResource {
  resource_id: string;
  resource_name: string;
  resource_type: 'maintenance_crew' | 'tower_wagon' | 'tamping_machine' | 'testing_team';
  home_corridor: string;
  contending_corridors: string[];
  requested_slots: {
    corridor: string;
    day: string;
    start_time: string;
    end_time: string;
    task_id: string;
    department: Department;
  }[];
  contention_status: 'conflict_flagged' | 'resolution_proposed' | 'allocated';
  resolution_notes: string;
}

export type UserRole = 'section_engineer' | 'controller' | 'drm';

export interface UserSession {
  role: UserRole;
  division: string;
  corridor: string;
  name: string;
  title: string;
}
