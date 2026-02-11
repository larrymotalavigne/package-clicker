import { Injectable, inject, computed } from '@angular/core';
import { GameStateService } from './game-state.service';
import { Employee, EmployeeType, EmployeeConfig } from '../models/game.models';
import { EMPLOYEE_CONFIGS, EMPLOYEE_NAMES } from '../config/employees.config';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private readonly gameStateService = inject(GameStateService);

  readonly employees = computed(
    () => this.gameStateService.gameState().employees
  );

  readonly totalHired = computed(
    () => this.gameStateService.gameState().totalEmployeesHired
  );

  getConfig(type: EmployeeType): EmployeeConfig | undefined {
    return EMPLOYEE_CONFIGS.find((c) => c.type === type);
  }

  getAllConfigs(): EmployeeConfig[] {
    return EMPLOYEE_CONFIGS;
  }

  getTypeCount(type: EmployeeType): number {
    return this.employees().filter((e) => e.type === type).length;
  }

  getHireCost(type: EmployeeType): number {
    const config = this.getConfig(type);
    if (!config) return Infinity;

    const count = this.getTypeCount(type);
    return Math.floor(config.baseCost * Math.pow(config.costMultiplier, count));
  }

  hire(type: EmployeeType): boolean {
    const cost = this.getHireCost(type);
    if (!this.gameStateService.spendExpressPoints(cost)) {
      return false;
    }

    const newEmployee = this.createEmployee(type);
    const updated = [...this.employees(), newEmployee];
    this.gameStateService.updateEmployees(updated);
    this.gameStateService.incrementEmployeesHired();
    return true;
  }

  tickEmployees(deltaMs: number): void {
    const list = this.employees();
    if (list.length === 0) return;

    const trainerBonus = this.getTrainerBonus();
    let changed = false;

    const updated = list.map((emp) => {
      const result = this.tickSingleEmployee(
        emp, deltaMs, trainerBonus
      );
      if (result !== emp) changed = true;
      return result;
    });

    if (changed) {
      this.gameStateService.updateEmployees(updated);
    }
  }

  getTrainerBonus(): number {
    return 1 + this.sumLevelsForType('trainer') * 0.1;
  }

  getSorterMultiplier(): number {
    return 1 + this.sumLevelsForType('sorter') * 0.05;
  }

  getScoutMultiplier(): number {
    return 1 + this.sumLevelsForType('scout') * 0.05;
  }

  getAccountantMultiplier(): number {
    return 1 + this.sumLevelsForType('accountant') * 0.05;
  }

  getManagerMultiplier(): number {
    return 1 + this.sumLevelsForType('manager') * 0.1;
  }

  hasAllTypes(): boolean {
    return EMPLOYEE_CONFIGS.every(
      (c) => this.getTypeCount(c.type) > 0
    );
  }

  private sumLevelsForType(type: EmployeeType): number {
    return this.employees()
      .filter((e) => e.type === type)
      .reduce((sum, e) => sum + e.level, 0);
  }

  private createEmployee(type: EmployeeType): Employee {
    const name = this.pickRandomName();
    return {
      id: this.generateId(),
      type,
      name,
      level: 1,
      xp: 0,
      assignment: null,
    };
  }

  private pickRandomName(): string {
    const idx = Math.floor(Math.random() * EMPLOYEE_NAMES.length);
    return EMPLOYEE_NAMES[idx];
  }

  private generateId(): string {
    return 'emp_' + Date.now().toString(36) + '_' +
      Math.random().toString(36).substring(2, 7);
  }

  private tickSingleEmployee(
    emp: Employee,
    deltaMs: number,
    trainerBonus: number
  ): Employee {
    const config = this.getConfig(emp.type);
    if (!config || emp.level >= config.maxLevel) return emp;

    const xpGain = deltaMs * 0.001 * trainerBonus;
    const newXp = emp.xp + xpGain;
    const xpToLevel = emp.level * 100;

    if (newXp >= xpToLevel) {
      return { ...emp, level: emp.level + 1, xp: 0 };
    }
    return { ...emp, xp: newXp };
  }
}
