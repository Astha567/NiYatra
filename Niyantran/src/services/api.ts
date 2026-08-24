import {
  MaintenanceTask,
  CorridorBusySlot,
  ScheduledBlock,
  Conflict,
  WeeklyPlan,
  MonthlyPlan,
  OfficerDecision,
  CorridorMetrics,
  CrossCorridorResource
} from '../types/schema';

// SWAPPABLE BASE URL CONSTANT
export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL || 'MOCK';

// Mock Tasks matching exact schema
export const MOCK_TASKS: MaintenanceTask[] = [
  {
    task_id: 'TASK-ENG-101',
    department: 'ENG',
    section_id: 'HWH-BDC',
    chainage_start_km: 12.4,
    chainage_end_km: 15.8,
    defect_type: 'USFD Rail Weld Flaw & Deep Screening',
    severity: 'critical',
    overdue_days: 14,
    estimated_block_minutes: 180,
    block_type: 'traffic_block',
    asset_criticality: 'high',
    priority_score: 94,
    criticality_score: 96,
    urgency_score: 92,
    network_impact_score: 88,
    recommended_block_slot: 'Tuesday, 01:30 - 04:30'
  },
  {
    task_id: 'TASK-TRD-204',
    department: 'TRD',
    section_id: 'HWH-BDC',
    chainage_start_km: 13.0,
    chainage_end_km: 16.2,
    defect_type: 'OHE Catenary Wire Stagger & Dropper Replacement',
    severity: 'major',
    overdue_days: 6,
    estimated_block_minutes: 150,
    block_type: 'power_block',
    asset_criticality: 'medium',
    priority_score: 82,
    criticality_score: 80,
    urgency_score: 85,
    network_impact_score: 78,
    recommended_block_slot: 'Tuesday, 02:00 - 04:30'
  },
  {
    task_id: 'TASK-SNT-308',
    department: 'SNT',
    section_id: 'HWH-BDC',
    chainage_start_km: 14.2,
    chainage_end_km: 14.8,
    defect_type: 'Point Machine Locking & Track Circuit Maintenance',
    severity: 'major',
    overdue_days: 4,
    estimated_block_minutes: 120,
    block_type: 'both',
    asset_criticality: 'high',
    priority_score: 88,
    criticality_score: 90,
    urgency_score: 86,
    network_impact_score: 84,
    recommended_block_slot: 'Tuesday, 02:00 - 04:00'
  },
  {
    task_id: 'TASK-ENG-102',
    department: 'ENG',
    section_id: 'HWH-KGP',
    chainage_start_km: 45.0,
    chainage_end_km: 48.5,
    defect_type: 'Turnout Renewal & Rail Joint Tamping',
    severity: 'critical',
    overdue_days: 18,
    estimated_block_minutes: 240,
    block_type: 'both',
    asset_criticality: 'high',
    priority_score: 96,
    criticality_score: 98,
    urgency_score: 95,
    network_impact_score: 92,
    recommended_block_slot: 'Wednesday, 00:30 - 04:30'
  },
  {
    task_id: 'TASK-SNT-309',
    department: 'SNT',
    section_id: 'HWH-KGP',
    chainage_start_km: 46.1,
    chainage_end_km: 47.0,
    defect_type: 'Axle Counter Sensor Replacement & Interlocking Check',
    severity: 'minor',
    overdue_days: 2,
    estimated_block_minutes: 90,
    block_type: 'traffic_block',
    asset_criticality: 'medium',
    priority_score: 65,
    criticality_score: 60,
    urgency_score: 70,
    network_impact_score: 62,
    recommended_block_slot: 'Wednesday, 01:00 - 02:30'
  },
  {
    task_id: 'TASK-TRD-205',
    department: 'TRD',
    section_id: 'BDC-KWAE',
    chainage_start_km: 22.0,
    chainage_end_km: 25.0,
    defect_type: 'Cantilever Insulator Cleaning & Isolator Maintenance',
    severity: 'minor',
    overdue_days: 1,
    estimated_block_minutes: 120,
    block_type: 'power_block',
    asset_criticality: 'low',
    priority_score: 58,
    criticality_score: 52,
    urgency_score: 55,
    network_impact_score: 60,
    recommended_block_slot: 'Thursday, 02:30 - 04:30'
  },
  {
    task_id: 'TASK-ENG-103',
    department: 'ENG',
    section_id: 'SDAH-RHA',
    chainage_start_km: 30.5,
    chainage_end_km: 33.1,
    defect_type: 'Ballast Cleaning Machine (BCM) Track Tamping',
    severity: 'major',
    overdue_days: 9,
    estimated_block_minutes: 210,
    block_type: 'traffic_block',
    asset_criticality: 'high',
    priority_score: 87,
    criticality_score: 88,
    urgency_score: 86,
    network_impact_score: 87,
    recommended_block_slot: 'Friday, 01:00 - 04:30'
  },
  {
    task_id: 'TASK-SNT-310',
    department: 'SNT',
    section_id: 'SDAH-RHA',
    chainage_start_km: 31.0,
    chainage_end_km: 32.5,
    defect_type: 'Automatic Block Signaling Relay Testing & Cable Repair',
    severity: 'critical',
    overdue_days: 12,
    estimated_block_minutes: 180,
    block_type: 'both',
    asset_criticality: 'high',
    priority_score: 93,
    criticality_score: 95,
    urgency_score: 91,
    network_impact_score: 90,
    recommended_block_slot: 'Friday, 01:30 - 04:30'
  },
  {
    task_id: 'TASK-TRD-206',
    department: 'TRD',
    section_id: 'HWH-KGP',
    chainage_start_km: 44.5,
    chainage_end_km: 47.8,
    defect_type: 'Substation Transformer Bushing Inspection & Contact Check',
    severity: 'major',
    overdue_days: 7,
    estimated_block_minutes: 135,
    block_type: 'power_block',
    asset_criticality: 'medium',
    priority_score: 79,
    criticality_score: 76,
    urgency_score: 82,
    network_impact_score: 78,
    recommended_block_slot: 'Wednesday, 01:30 - 03:45'
  },
  {
    task_id: 'TASK-ENG-104',
    department: 'ENG',
    section_id: 'BDC-KWAE',
    chainage_start_km: 18.2,
    chainage_end_km: 21.0,
    defect_type: 'SEJ (Switch Expansion Joint) Gap Adjustment & Greasing',
    severity: 'minor',
    overdue_days: 3,
    estimated_block_minutes: 90,
    block_type: 'traffic_block',
    asset_criticality: 'low',
    priority_score: 62,
    criticality_score: 58,
    urgency_score: 64,
    network_impact_score: 61,
    recommended_block_slot: 'Thursday, 01:00 - 02:30'
  }
];

export const MOCK_BUSY_SLOTS: CorridorBusySlot[] = [
  {
    section_id: 'HWH-BDC',
    day: 'Tuesday',
    start_time: '04:45',
    end_time: '08:30',
    train_type: 'passenger',
    train_id: '12339-Coalfield Express'
  },
  {
    section_id: 'HWH-BDC',
    day: 'Tuesday',
    start_time: '21:00',
    end_time: '23:45',
    train_type: 'freight',
    train_id: 'BOXN-Freight-772'
  },
  {
    section_id: 'HWH-KGP',
    day: 'Wednesday',
    start_time: '05:00',
    end_time: '09:00',
    train_type: 'passenger',
    train_id: '12863-Howrah-SMVB Express'
  }
];

export const MOCK_SCHEDULED_BLOCKS: ScheduledBlock[] = [
  {
    block_id: 'BLK-2026-W1-01',
    section_id: 'HWH-BDC',
    day: 'Tuesday',
    week_number: 1,
    start_time: '01:30',
    end_time: '04:30',
    tasks: [MOCK_TASKS[0], MOCK_TASKS[1], MOCK_TASKS[2]],
    departments_involved: ['ENG', 'TRD', 'SNT'],
    is_merged: true,
    total_priority_score: 95.5,
    reasoning: 'Pulse unified 3 departmental requests into a single 180-min shadow window (ENG Rail Weld + TRD OHE + SNT Point Lock). Zero passenger train disruption during non-peak hours.',
    status: 'pending_review',
    is_customizable: true,
    customizable_task_ids: ['TASK-ENG-101', 'TASK-TRD-204', 'TASK-SNT-308']
  },
  {
    block_id: 'BLK-2026-W1-02',
    section_id: 'HWH-KGP',
    day: 'Wednesday',
    week_number: 1,
    start_time: '00:30',
    end_time: '04:30',
    tasks: [MOCK_TASKS[3], MOCK_TASKS[4]],
    departments_involved: ['ENG', 'SNT'],
    is_merged: true,
    total_priority_score: 91.0,
    reasoning: 'Pulse combined critical Turnout Renewal with Axle Counter Sensor Replacement during low-density freight corridor window.',
    status: 'approved',
    is_customizable: true,
    customizable_task_ids: ['TASK-ENG-102', 'TASK-SNT-309'],
    officer_decision: {
      decided_by: 'Sr. DEN (Co-ord) Howrah',
      action: 'approve',
      comment: 'Approved as recommended by Pulse AI. Speed restriction will be lifted by 06:00.'
    }
  },
  {
    block_id: 'BLK-2026-W1-03',
    section_id: 'BDC-KWAE',
    day: 'Thursday',
    week_number: 1,
    start_time: '02:30',
    end_time: '04:30',
    tasks: [MOCK_TASKS[5], MOCK_TASKS[9]],
    departments_involved: ['TRD', 'ENG'],
    is_merged: true,
    total_priority_score: 84.0,
    reasoning: 'Pulse merged TRD Cantilever Insulator Cleaning with ENG SEJ Gap Adjustment during night window.',
    status: 'pending_review',
    is_customizable: true,
    customizable_task_ids: ['TASK-TRD-205', 'TASK-ENG-104']
  },
  {
    block_id: 'BLK-2026-W1-04',
    section_id: 'SDAH-RHA',
    day: 'Friday',
    week_number: 1,
    start_time: '01:00',
    end_time: '04:30',
    tasks: [MOCK_TASKS[6], MOCK_TASKS[7]],
    departments_involved: ['ENG', 'SNT'],
    is_merged: true,
    total_priority_score: 92.5,
    reasoning: 'Pulse synchronized Ballast Cleaning Machine (BCM) track tamping with Automatic Block Signaling relay testing on SDAH-RHA main line.',
    status: 'pending_review',
    is_customizable: true,
    customizable_task_ids: ['TASK-ENG-103', 'TASK-SNT-310']
  },
  {
    block_id: 'BLK-2026-W1-05',
    section_id: 'HWH-BDC',
    day: 'Saturday',
    week_number: 1,
    start_time: '02:00',
    end_time: '04:00',
    tasks: [MOCK_TASKS[1]],
    departments_involved: ['TRD'],
    is_merged: false,
    total_priority_score: 82.0,
    reasoning: 'Single-department TRD Catenary Dropper replacement block on HWH-BDC section.',
    status: 'customized',
    is_customizable: false,
    customizable_task_ids: [],
    officer_decision: {
      decided_by: 'Sr. DEE (TRD) Howrah',
      action: 'retime_task',
      new_start_time: '02:00',
      comment: 'Retimed by controller to fit between late night parcel express train paths.'
    }
  }
];

export const MOCK_CONFLICTS: Conflict[] = [
  {
    section_id: 'HWH-BDC',
    day: 'Tuesday',
    week_number: 1,
    overlapping_tasks: [MOCK_TASKS[0], MOCK_TASKS[1], MOCK_TASKS[2]],
    resolution: 'merged',
    reasoning: 'Independent requests from ENG (180 mins), TRD (150 mins), and SNT (120 mins) overlap on km 13.0 - 16.2. Pulse successfully merged them into a co-ordinated 180-min shadow window on Tuesday 01:30 - 04:30.'
  },
  {
    section_id: 'HWH-KGP',
    day: 'Wednesday',
    week_number: 1,
    overlapping_tasks: [MOCK_TASKS[3], MOCK_TASKS[8]],
    resolution: 'pending',
    reasoning: 'High-priority Turnout Renewal (ENG 240 mins, Score 96) conflicts with OHE Transformer Bushing Inspection (TRD 135 mins, Score 79) on km 45.0 during Wednesday night freight corridor slot.'
  },
  {
    section_id: 'SDAH-RHA',
    day: 'Friday',
    week_number: 1,
    overlapping_tasks: [MOCK_TASKS[6], MOCK_TASKS[7]],
    resolution: 'pending',
    reasoning: 'Ballast Cleaning Machine Tamping (ENG 210 mins, Score 87) overlaps with Automatic Signaling Relay Cable Repair (SNT 180 mins, Score 93) on km 30.5 - 33.1.'
  },
  {
    section_id: 'BDC-KWAE',
    day: 'Thursday',
    week_number: 1,
    overlapping_tasks: [MOCK_TASKS[5], MOCK_TASKS[9]],
    resolution: 'merged',
    reasoning: 'Pulse merged TRD Insulator Cleaning (120 mins) with ENG SEJ Gap Adjustment (90 mins) on Thursday 02:30 - 04:30 shadow window.'
  }
];

export const MOCK_WEEKLY_PLAN: WeeklyPlan = {
  week_number: 1,
  week_start: '2026-08-25',
  scheduled_blocks: MOCK_SCHEDULED_BLOCKS,
  unscheduled_tasks: [MOCK_TASKS[5]],
  unscheduled_reason: {
    'TASK-TRD-205': 'Deferred to Week 2 due to high-density passenger train movements on BDC-KWAE section during requested hours.'
  }
};

export const MOCK_MONTHLY_PLAN: MonthlyPlan = {
  month: 'August 2026',
  weeks: [MOCK_WEEKLY_PLAN],
  section_summary: [
    {
      section_id: 'HWH-BDC',
      blocks_planned: 14,
      backlog_cleared: 38,
      backlog_remaining: 4
    },
    {
      section_id: 'HWH-KGP',
      blocks_planned: 18,
      backlog_cleared: 42,
      backlog_remaining: 6
    },
    {
      section_id: 'BDC-KWAE',
      blocks_planned: 8,
      backlog_cleared: 22,
      backlog_remaining: 5
    },
    {
      section_id: 'SDAH-RHA',
      blocks_planned: 10,
      backlog_cleared: 26,
      backlog_remaining: 8
    }
  ],
  generated_at: '2026-08-23T23:40:00Z'
};

// Stage 1 Mock Data: Corridor Comparison Matrix for DRM Division Overview
export const MOCK_CORRIDOR_METRICS: CorridorMetrics[] = [
  {
    corridor_id: 'HWH-BDC',
    corridor_name: 'HWH-BDC (Howrah - Bandel Main Line)',
    division: 'Howrah Division (HWH)',
    asset_availability_pct: 98.4,
    overdue_defects_count: 6,
    pending_blocks_count: 5,
    approved_blocks_count: 14,
    downtime_trend_pct: -3.8,
    critical_defects_count: 1,
    active_sections: 4
  },
  {
    corridor_id: 'HWH-KGP',
    corridor_name: 'HWH-KGP (Howrah - Kharagpur Section)',
    division: 'Howrah Division (HWH)',
    asset_availability_pct: 96.8,
    overdue_defects_count: 9,
    pending_blocks_count: 7,
    approved_blocks_count: 18,
    downtime_trend_pct: +1.4,
    critical_defects_count: 2,
    active_sections: 6
  },
  {
    corridor_id: 'BDC-KWAE',
    corridor_name: 'BDC-KWAE (Bandel - Katwa Branch Line)',
    division: 'Howrah Division (HWH)',
    asset_availability_pct: 99.1,
    overdue_defects_count: 3,
    pending_blocks_count: 2,
    approved_blocks_count: 8,
    downtime_trend_pct: -6.2,
    critical_defects_count: 0,
    active_sections: 3
  },
  {
    corridor_id: 'SDAH-RHA',
    corridor_name: 'SDAH-RHA (Sealdah - Ranaghat Main Line)',
    division: 'Sealdah Division (SDAH)',
    asset_availability_pct: 97.2,
    overdue_defects_count: 7,
    pending_blocks_count: 4,
    approved_blocks_count: 10,
    downtime_trend_pct: -1.8,
    critical_defects_count: 1,
    active_sections: 5
  }
];

// Stage 1 Mock Data: Inter-Corridor Resource Contention for DRM Overview
export const MOCK_CROSS_CORRIDOR_RESOURCES: CrossCorridorResource[] = [
  {
    resource_id: 'RES-TW-04',
    resource_name: '8-Wheeler Tower Wagon #04 (OHE Maintenance)',
    resource_type: 'tower_wagon',
    home_corridor: 'HWH-BDC',
    contending_corridors: ['HWH-BDC', 'BDC-KWAE'],
    requested_slots: [
      {
        corridor: 'HWH-BDC',
        day: 'Tuesday',
        start_time: '02:00',
        end_time: '04:30',
        task_id: 'TASK-TRD-204',
        department: 'TRD'
      },
      {
        corridor: 'BDC-KWAE',
        day: 'Tuesday',
        start_time: '03:00',
        end_time: '05:00',
        task_id: 'TASK-TRD-205',
        department: 'TRD'
      }
    ],
    contention_status: 'conflict_flagged',
    resolution_notes: 'Overlap on Tuesday morning 03:00-04:30 between HWH-BDC (km 13) and BDC-KWAE (km 22). Pulse recommends shifting BDC-KWAE slot to 05:00.'
  },
  {
    resource_id: 'RES-BCM-02',
    resource_name: 'Heavy Duty Track Tamping Express (CSM 09-32)',
    resource_type: 'tamping_machine',
    home_corridor: 'HWH-KGP',
    contending_corridors: ['HWH-KGP', 'HWH-BDC'],
    requested_slots: [
      {
        corridor: 'HWH-KGP',
        day: 'Wednesday',
        start_time: '00:30',
        end_time: '04:30',
        task_id: 'TASK-ENG-102',
        department: 'ENG'
      },
      {
        corridor: 'HWH-BDC',
        day: 'Wednesday',
        start_time: '01:30',
        end_time: '04:30',
        task_id: 'TASK-ENG-101',
        department: 'ENG'
      }
    ],
    contention_status: 'resolution_proposed',
    resolution_notes: 'Pulse proposed allocating Machine #02 to high-criticality HWH-KGP turnout renewal on Wednesday, and shifting HWH-BDC deep screening to Thursday morning.'
  }
];

// API Methods
export async function getTasks(): Promise<MaintenanceTask[]> {
  if (API_BASE_URL === 'MOCK') return Promise.resolve(MOCK_TASKS);
  const res = await fetch(`${API_BASE_URL}/tasks`);
  return res.json();
}

export async function getBusySlots(sectionId?: string, day?: string): Promise<CorridorBusySlot[]> {
  if (API_BASE_URL === 'MOCK') {
    let result = MOCK_BUSY_SLOTS;
    if (sectionId) result = result.filter(s => s.section_id === sectionId);
    if (day) result = result.filter(s => s.day === day);
    return Promise.resolve(result);
  }
  const params = new URLSearchParams();
  if (sectionId) params.append('section_id', sectionId);
  if (day) params.append('day', day);
  const res = await fetch(`${API_BASE_URL}/busy-slots?${params.toString()}`);
  return res.json();
}

export async function getWeeklyPlan(weekNumber: number): Promise<WeeklyPlan> {
  if (API_BASE_URL === 'MOCK') return Promise.resolve(MOCK_WEEKLY_PLAN);
  const res = await fetch(`${API_BASE_URL}/weekly-plan/${weekNumber}`);
  return res.json();
}

export async function getMonthlyPlan(): Promise<MonthlyPlan> {
  if (API_BASE_URL === 'MOCK') return Promise.resolve(MOCK_MONTHLY_PLAN);
  const res = await fetch(`${API_BASE_URL}/monthly-plan`);
  return res.json();
}

export async function getConflicts(): Promise<Conflict[]> {
  if (API_BASE_URL === 'MOCK') return Promise.resolve(MOCK_CONFLICTS);
  const res = await fetch(`${API_BASE_URL}/conflicts`);
  return res.json();
}

export async function patchBlock(
  blockId: string,
  body: OfficerDecision
): Promise<ScheduledBlock> {
  if (API_BASE_URL === 'MOCK') {
    const block = MOCK_SCHEDULED_BLOCKS.find(b => b.block_id === blockId);
    if (!block) throw new Error(`Block ${blockId} not found`);

    if (body.action === 'approve') {
      block.status = 'approved';
    } else if (body.action === 'reject') {
      block.status = 'rejected';
    } else if (body.action === 'remove_task' && body.target_task_id) {
      block.status = 'customized';
      block.tasks = block.tasks.filter(t => t.task_id !== body.target_task_id);
      block.customizable_task_ids = block.customizable_task_ids.filter(id => id !== body.target_task_id);
      // Recalculate departments involved
      const depts = new Set(block.tasks.map(t => t.department));
      block.departments_involved = Array.from(depts);
      block.is_merged = block.departments_involved.length > 1;
    } else if (body.action === 'retime_task' && body.new_start_time) {
      block.status = 'customized';
      block.start_time = body.new_start_time;
    }
    
    block.officer_decision = body;
    return Promise.resolve({ ...block });
  }

  const res = await fetch(`${API_BASE_URL}/blocks/${blockId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return res.json();
}

export async function getHealth(): Promise<{ status: string }> {
  if (API_BASE_URL === 'MOCK') return Promise.resolve({ status: 'ok' });
  const res = await fetch(`${API_BASE_URL}/health`);
  return res.json();
}

// Stage 1 Extra API Helpers
export async function getCorridorMetrics(): Promise<CorridorMetrics[]> {
  if (API_BASE_URL === 'MOCK') return Promise.resolve(MOCK_CORRIDOR_METRICS);
  const res = await fetch(`${API_BASE_URL}/corridor-metrics`);
  return res.json();
}

export async function getCrossCorridorResources(): Promise<CrossCorridorResource[]> {
  if (API_BASE_URL === 'MOCK') return Promise.resolve(MOCK_CROSS_CORRIDOR_RESOURCES);
  const res = await fetch(`${API_BASE_URL}/cross-corridor-resources`);
  return res.json();
}
