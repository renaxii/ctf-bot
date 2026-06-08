export class HealthService {
  ping(): string {
    return "Pong!";
  }
}

export const healthService = new HealthService();
