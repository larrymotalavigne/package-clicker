import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ResearchNode, ActiveResearch } from '../../models/game.models';

@Component({
  selector: 'app-research-panel',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="overlay" (click)="onOverlayClick($event)">
      <div class="panel">
        <div class="panel-header">
          <h2>Research Tree</h2>
          <button class="close-btn" (click)="closePanel.emit()">x</button>
        </div>

        <div class="branch-labels">
          <span class="branch-label logistics">Logistics</span>
          <span class="branch-label engineering">Engineering</span>
          <span class="branch-label finance">Finance</span>
          <span class="branch-label innovation">Innovation</span>
        </div>

        <div class="tree-area">
          <div class="branch-columns">
            @for (col of branchOrder; track col) {
              <div class="branch-col">
                @for (node of getNodesForBranch(col); track node.id) {
                  <div
                    class="node"
                    [class.completed]="isNodeCompleted(node.id)"
                    [class.active]="isNodeActive(node.id)"
                    [class.available]="isNodeAvailable(node)"
                    [class.locked]="isNodeLocked(node)"
                    (click)="onNodeClick(node)"
                    (mouseenter)="hoverNode = node"
                    (mouseleave)="hoverNode = null"
                  >
                    <span class="node-icon">{{ node.icon }}</span>
                    <span class="node-name">{{ node.name }}</span>
                    @if (isNodeActive(node.id) && active) {
                      <div class="progress-bar">
                        <div
                          class="progress-fill"
                          [style.width]="getProgressPct()"
                        ></div>
                      </div>
                      <span class="time-remaining">
                        {{ formatTime(active.remainingMs) }}
                      </span>
                    }
                  </div>
                }
              </div>
            }
          </div>
        </div>

        @if (hoverNode) {
          <div class="tooltip-box">
            <div class="tooltip-title">
              {{ hoverNode.icon }} {{ hoverNode.name }}
            </div>
            <div class="tooltip-desc">{{ hoverNode.description }}</div>
            <div class="tooltip-cost">
              Cost: {{ hoverNode.cost.ep }} EP
              \u00B7 {{ formatTime(hoverNode.cost.timeMs) }}
            </div>
            <div class="tooltip-effects">
              @for (e of hoverNode.effects; track e.type) {
                <span class="effect-tag">
                  {{ formatEffect(e.type, e.value) }}
                </span>
              }
            </div>
            @if (isNodeCompleted(hoverNode.id)) {
              <div class="tooltip-state completed-tag">Completed</div>
            }
            @if (isNodeLocked(hoverNode)) {
              <div class="tooltip-state locked-tag">
                Requires: {{ getRequiredNames(hoverNode) }}
              </div>
            }
          </div>
        }

        <div class="ep-balance">
          Express Points: <span class="ep-value">{{ expressPoints }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 20, 0.92);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.2s ease-out;
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      .panel {
        background: linear-gradient(180deg, #0d0d2b, #1a1a3e);
        border: 1px solid rgba(100, 180, 255, 0.15);
        border-radius: 12px;
        width: 94%;
        max-width: 720px;
        max-height: 92vh;
        overflow-y: auto;
        color: #e0e0e0;
        padding: 20px;
        animation: zoomIn 0.35s ease-out;
      }
      @keyframes zoomIn {
        from { opacity: 0; transform: scale(0.85); }
        to { opacity: 1; transform: scale(1); }
      }
      .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      }
      .panel-header h2 {
        margin: 0;
        color: #82c8ff;
        font-size: 1.3em;
      }
      .close-btn {
        background: none;
        border: none;
        color: #888;
        font-size: 1.2em;
        cursor: pointer;
      }
      .close-btn:hover { color: #ccc; }
      .branch-labels {
        display: flex;
        gap: 4px;
        margin-bottom: 8px;
      }
      .branch-label {
        flex: 1;
        text-align: center;
        font-size: 0.75em;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        padding: 4px 0;
        border-radius: 4px;
      }
      .branch-label.logistics { color: #4ea8de; background: rgba(78,168,222,0.1); }
      .branch-label.engineering { color: #e8a035; background: rgba(232,160,53,0.1); }
      .branch-label.finance { color: #5ec97b; background: rgba(94,201,123,0.1); }
      .branch-label.innovation { color: #b07ee8; background: rgba(176,126,232,0.1); }
      .tree-area {
        background: rgba(0, 0, 0, 0.25);
        border-radius: 8px;
        padding: 12px 8px;
        margin-bottom: 12px;
      }
      .branch-columns {
        display: flex;
        gap: 8px;
      }
      .branch-col {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .node {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        padding: 10px 4px;
        border-radius: 8px;
        border: 2px solid rgba(255, 255, 255, 0.08);
        background: rgba(255, 255, 255, 0.03);
        cursor: default;
        transition: all 0.2s;
        min-height: 62px;
        position: relative;
      }
      .node-icon { font-size: 1.3em; }
      .node-name {
        font-size: 0.65em;
        text-align: center;
        line-height: 1.2;
        opacity: 0.9;
      }
      /* Completed */
      .node.completed {
        border-color: #ffd700;
        background: rgba(255, 215, 0, 0.12);
        box-shadow: 0 0 8px rgba(255, 215, 0, 0.2);
      }
      .node.completed .node-name { color: #ffd700; }
      /* Active (researching) */
      .node.active {
        border-color: #82c8ff;
        background: rgba(130, 200, 255, 0.1);
        animation: pulse 1.5s infinite;
      }
      @keyframes pulse {
        0%, 100% { box-shadow: 0 0 4px rgba(130,200,255,0.2); }
        50% { box-shadow: 0 0 12px rgba(130,200,255,0.4); }
      }
      /* Available */
      .node.available {
        cursor: pointer;
      }
      .node.available:hover {
        transform: scale(1.04);
        filter: brightness(1.2);
      }
      .branch-col:nth-child(1) .node.available {
        border-color: rgba(78,168,222,0.5);
        background: rgba(78,168,222,0.08);
      }
      .branch-col:nth-child(2) .node.available {
        border-color: rgba(232,160,53,0.5);
        background: rgba(232,160,53,0.08);
      }
      .branch-col:nth-child(3) .node.available {
        border-color: rgba(94,201,123,0.5);
        background: rgba(94,201,123,0.08);
      }
      .branch-col:nth-child(4) .node.available {
        border-color: rgba(176,126,232,0.5);
        background: rgba(176,126,232,0.08);
      }
      /* Locked */
      .node.locked {
        opacity: 0.35;
      }
      /* Progress bar */
      .progress-bar {
        width: 80%;
        height: 4px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
        overflow: hidden;
        margin-top: 2px;
      }
      .progress-fill {
        height: 100%;
        background: #82c8ff;
        border-radius: 2px;
        transition: width 0.1s linear;
      }
      .time-remaining {
        font-size: 0.55em;
        color: #82c8ff;
      }
      /* Tooltip */
      .tooltip-box {
        background: linear-gradient(180deg, #1a1a3e, #0d0d2b);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 8px;
        padding: 12px;
        margin-bottom: 12px;
      }
      .tooltip-title {
        font-size: 0.95em;
        font-weight: 700;
        margin-bottom: 4px;
        color: #fff;
      }
      .tooltip-desc {
        font-size: 0.8em;
        color: #bbb;
        margin-bottom: 6px;
      }
      .tooltip-cost {
        font-size: 0.75em;
        color: #82c8ff;
        margin-bottom: 6px;
      }
      .tooltip-effects {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        margin-bottom: 4px;
      }
      .effect-tag {
        font-size: 0.7em;
        padding: 2px 6px;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.06);
        color: #7cc576;
      }
      .tooltip-state {
        font-size: 0.7em;
        margin-top: 4px;
      }
      .completed-tag { color: #ffd700; }
      .locked-tag { color: #e06060; }
      /* EP balance footer */
      .ep-balance {
        text-align: center;
        font-size: 0.85em;
        color: #aaa;
        padding-top: 8px;
        border-top: 1px solid rgba(255, 255, 255, 0.06);
      }
      .ep-value {
        color: #82c8ff;
        font-weight: 700;
      }
    `,
  ],
})
export class ResearchPanelComponent {
  @Input() nodes: ResearchNode[] = [];
  @Input() completed: string[] = [];
  @Input() active: ActiveResearch | null = null;
  @Input() expressPoints: number = 0;
  @Output() closePanel = new EventEmitter<void>();
  @Output() startResearch = new EventEmitter<ResearchNode>();

  hoverNode: ResearchNode | null = null;

  readonly branchOrder: ResearchNode['branch'][] = [
    'logistics',
    'engineering',
    'finance',
    'innovation',
  ];

  getNodesForBranch(branch: string): ResearchNode[] {
    return this.nodes
      .filter((n) => n.branch === branch)
      .sort((a, b) => a.position.y - b.position.y);
  }

  isNodeCompleted(id: string): boolean {
    return this.completed.includes(id);
  }

  isNodeActive(id: string): boolean {
    return this.active?.nodeId === id;
  }

  isNodeAvailable(node: ResearchNode): boolean {
    if (this.isNodeCompleted(node.id)) return false;
    if (this.isNodeActive(node.id)) return false;
    if (this.active !== null) return false;
    const hasReqs = node.requires.every((r) =>
      this.completed.includes(r)
    );
    return hasReqs && this.expressPoints >= node.cost.ep;
  }

  isNodeLocked(node: ResearchNode): boolean {
    if (this.isNodeCompleted(node.id)) return false;
    if (this.isNodeActive(node.id)) return false;
    return !this.isNodeAvailable(node);
  }

  onNodeClick(node: ResearchNode): void {
    if (this.isNodeAvailable(node)) {
      this.startResearch.emit(node);
    }
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('overlay')) {
      this.closePanel.emit();
    }
  }

  getProgressPct(): string {
    if (!this.active || this.active.totalMs === 0) return '0%';
    const elapsed = this.active.totalMs - this.active.remainingMs;
    const pct = Math.min(100, (elapsed / this.active.totalMs) * 100);
    return pct.toFixed(1) + '%';
  }

  formatTime(ms: number): string {
    const totalSec = Math.ceil(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    if (min === 0) return sec + 's';
    return min + 'm ' + sec + 's';
  }

  formatEffect(type: string, value: number): string {
    const pct = Math.round((value - 1) * 100);
    const label = this.effectLabel(type);
    return '+' + pct + '% ' + label;
  }

  getRequiredNames(node: ResearchNode): string {
    return node.requires
      .map((r) => {
        const dep = this.nodes.find((n) => n.id === r);
        return dep ? dep.name : r;
      })
      .join(', ');
  }

  private effectLabel(type: string): string {
    switch (type) {
      case 'global_multiplier': return 'production';
      case 'click_multiplier': return 'click power';
      case 'express_point_mult': return 'EP earnings';
      case 'golden_frequency': return 'golden freq';
      case 'offline_mult': return 'offline earnings';
      default: return type;
    }
  }
}
