import type { User as AuthUser } from "#auth-utils";

declare global {
  interface GameData {
    account: {
      gameName: string;
      tagLine: string;
    };
    game: {
      version: string;
      started: boolean;
      startedAt: string;
      dragonSlots: number;
      dragonSoul: string;
    };
    resources: {
      cdn: string;
    };
    players: Player[];
    teams: {
      blue: TeamStats;
      red: TeamStats;
    };
  }

  interface Player {
    champion: {
      displayName: string;
      iconURL: string;
    };
    isDead: boolean;
    level: number;
    position: string;
    respawnTimer: number;
    riotId: string;
    riotIdGameName: string;
    riotIdTagLine: string;
    summonerName: string;
    team: string;
    scores: {
      assists: number;
      creepScore: number;
      deaths: number;
      kills: number;
      wardScore: number;
    };
    items: {
      displayName: string;
      slot: number;
      count: number;
      iconURL: string;
    }[];
    runes: {
      keystone: {
        displayName: string;
        iconURL: string;
      };
      primaryRuneTree: {
        displayName: string;
        iconURL: string;
      };
      secondaryRuneTree: {
        displayName: string;
        iconURL: string;
      };
    };
    summonerSpells: {
      summonerSpellOne: {
        displayName: string;
        iconURL: string;
      };
      summonerSpellTwo: {
        displayName: string;
        iconURL: string;
      };
    };
  }

  interface TeamStats {
    score: number;
    dragons: number;
    dragonTypes: string[];
    grubs: number;
    heralds: number;
    barons: number;
    turrets: number;
  }

  type User = AuthUser;
}

export {};
