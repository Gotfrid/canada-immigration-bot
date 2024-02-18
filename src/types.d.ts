interface RoundRaw {
  /**
   * Number of the sample draw
   * @example "282"
   */
  drawNumber: string;

  /**
   * URL to a web page with detailed information about the round
   * @example "<a href='/content/canadasite/en/immigration-refugees-citizenship/corporate/mandate/policies-operational-instructions-agreements/ministerial-instructions/express-entry-rounds/invitations.html?q=282'>282</a>";
   */
  drawNumberURL: string;

  /**
   * Date of the sample draw
   * @example "2024-02-01"
   */
  drawDate: string;

  /**
   * Date of the sample draw
   * @example "February 1, 2024"
   */
  drawDateFull: string;

  /**
   * Name of the sample draw
   * @example "French language proficiency (2023-1)"
   */
  drawName: string;

  /** Size of the sample draw - formatted string
   * @example "7,000"
   */
  drawSize: string;

  /** CRS of the sample draw (passing score)
   * @example "365"
   */
  drawCRS: string;

  /**
   * @example "<a href='/content/canadasite/en/immigration-refugees-citizenship/corporate/mandate/policies-operational-instructions-agreements/ministerial-instructions/express-entry-rounds/invitations.html?q=282'>Invitations to apply for permanent residence under the Express Entry system #282</a>";
   */
  mitext: string;

  /**
   * @example"<a href='/content/canadasite/en/immigration-refugees-citizenship/corporate/mandate/policies-operational-instructions-agreements/ministerial-instructions/express-entry-rounds/invitations.html?q=282'>See full text of Ministerial Instruction</a>";
   */
  DrawText1: string;

  /**
   * @example "Federal Skilled Worker Program, Canadian Experience Class and Federal Skilled Trades Program";
   */
  drawText2: string;

  /** Exact time of the sample draw
   * @example "February 01, 2024 at 16:36:01 UTC"
   */
  drawDateTime: string;

  /** Not sure what it is exactly, but the date is much earlier than draw date
   * @example "September 08, 2023 at 09:47:27 UTC"
   */
  drawCutOff: string;

  /**
   * @example "January 30, 2024"
   */
  drawDistributionAsOn: string;

  /**
   * Amount of applicants in a certain bracket of the sample draw.
   * Each dd* item represents a certain score range. To learn more see distributionKeyMapping.js
   * @example 534
   */
  dd1: string;
  dd2: string;
  dd3: string;
  dd4: string;
  dd5: string;
  dd6: string;
  dd7: string;
  dd8: string;
  dd9: string;
  dd10: string;
  dd11: string;
  dd12: string;
  dd13: string;
  dd14: string;
  dd15: string;
  dd16: string;
  dd17: string;
  dd18: string;
}

interface RoundResponse {
  classes: string;
  rounds: RoundRaw[];
}

/**
 * Information about a round (draw, sample) without distribution and other unwanted info
 */
interface RoundClean
  extends Pick<RoundRaw, "drawNumber" | "drawDate" | "drawDateFull" | "drawDateTime" | "drawName"> {
  /** Size (raw) of the sample draw
   * @example "1,500"
   */
  drawSizeStr: string;

  /** Size (parsed) of the sample draw
   * @example 1500
   */
  drawSizeNum: number;

  /** CRS of the sample draw (passing score) parsed as a number
   * @example 388
   */
  drawCRS: number;
}

/** Round distribution data without round information itself */
interface DistributionClean {
  drawNumber: string;
  drawDate: string;
  drawDistributionAsOn: string;
  dd1: number;
  dd2: number;
  dd3: number;
  dd4: number;
  dd5: number;
  dd6: number;
  dd7: number;
  dd8: number;
  dd9: number;
  dd10: number;
  dd11: number;
  dd12: number;
  dd13: number;
  dd14: number;
  dd15: number;
  dd16: number;
  dd17: number;
  dd18: number;
}

interface TelegramUser {
  chatID: number;
  firstName: string;
  lastName: string;
  startedAt: Date;
}

interface TelegramSubscriber extends Omit<TelegramUser, "startedAt"> {
  subscribedAt: Date;
}
