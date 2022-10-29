import { LocalDataUpdateService } from './local-data-update.service';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { PersonalPeriodStakeSetup } from '../models/personal-period-stake-setup';
import { SlotData } from '../models/slot-data';
import { SlotType } from './../models/slot-data';
import { GriseTokenContractService } from './grise-token-contract.service';
import { LiquidityContractService } from './liquidity-contract.service';
import { StakingTokenContractService } from './staking-token-contract.service';

@Injectable({ providedIn: 'root' })
export class SharedService {
    // startTimeJS = new Date('Mar 12, 2021 08:00:00').getTime();
    launchTime = 0;
    startTime = 0;
    endTime = 0;
    allSlots: SlotData[];
    intervalId: any;
    allPersonalPeriodStakes: PersonalPeriodStakeSetup[];

    constructor(private liquidityContractService: LiquidityContractService,
        private stakingTokenContractService: StakingTokenContractService,
        private griseTokenContractService: GriseTokenContractService,
        private localDataUpdateService: LocalDataUpdateService) {
        this.getLaunchTime();
    }

    getLaunchTime() {
        this.griseTokenContractService.getLaunchTime().then(launchTimeData => {
            if (launchTimeData) {
                this.launchTime = launchTimeData.launchTime;
                this.startTime = launchTimeData.lpLaunchTime;
                //this.startTime = (launchTimeData.launchTime) + (1000 * 60 * 60 * this.localDataUpdateService.slotMaxHours);
                this.endTime = this.startTime + ((1000 * 60 * 60 * this.localDataUpdateService.slotMaxHours) * this.localDataUpdateService.totalSlots);
                this.localDataUpdateService.forceInitSlotsReservationData(true);
            }
        });
    }

    getTimeLeft(toTime?: number): string {
        if (!toTime) {
            return '';
        }

        const now = new Date().getTime();
        const distance = toTime - now;
        if (distance <= 0) {
            return 'EXPIRED';
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        return days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's';
    }

    getCurrentTimeProgess(fromTime?: number, toTime?: number): number {
        if (!fromTime || !toTime) {
            return 0;
        }
        const now = new Date().getTime();
        const distanceFrom = now - fromTime;
        if (distanceFrom <= 0) {
            return 0;
        }

        if (toTime - now <= 0) {
            return 100;
        }

        return Math.round(distanceFrom / (toTime - fromTime) * 100);
    }

    initSlots() {
        const startdate = new Date(this.startTime);

        this.allSlots = [];
        this.allSlots = [
            { id: 1, name: '6000', type: SlotType.Fixed, color: '#6610f2', isSelected: false, isExpired: false , nftImg:"assets/mythic/mythic.png", nftDetail:"2 Mythic NFT'S will be given away, Among which 1 will be given to the highest contributor and 1 will be give away to a random address. "},
            { id: 2, name: '6000', type: SlotType.Fixed, color: '#6610f2', isSelected: false, isExpired: false , nftImg:"assets/legend/l1.png", nftDetail:"4 Legendary NFT'S will be given away, Among which 2 will be given to the highest contributors and 2 will be given away to 2 random addresses. "},
            { id: 3, name: '6000', type: SlotType.Fixed, color: '#6610f2', isSelected: false, isExpired: false , nftImg:"assets/legend/l2.png", nftDetail:"4 Legendary NFT'S  will be given away, Among which 2 will be given to the highest contributors and 2 will be given away to 2 random addresses. "},
            { id: 4, name: '6000', type: SlotType.Fixed, color: '#6610f2', isSelected: false, isExpired: false , nftImg:"assets/rare/r1.png", nftDetail:"8 Rares NFT'S will be given away, Among which 4 will be given to the top 4 contributors and 4 will be given away to 4 random addresses."},
            { id: 5, name: '6000', type: SlotType.Fixed, color: '#6610f2', isSelected: false, isExpired: false , nftImg:"assets/common/c1.png", nftDetail:"16 common NFT'S will be given away, Among which 8 will be given to the top 8 contributors and 8 will be given away to 8 random addresse."},
            { id: 6, name: '6000', type: SlotType.Fixed, color: '#6610f2', isSelected: false, isExpired: false , nftImg:"assets/common/c2.png", nftDetail:"16 common NFT'S will be given away, Among which 8 will be given to the top 8 contributors and 8 will be given away to 8 random addresses"},
            { id: 7, name: '6000', type: SlotType.Fixed, color: '#6610f2', isSelected: false, isExpired: false , nftImg:"assets/common/c3.png", nftDetail:"16 common NFT'S will be given away, Among which 8 will be given to the top 8 contributors and 8 will be given away to 8 random addresses"},
            { id: 8, name: '6000', type: SlotType.Fixed, color: '#6610f2', isSelected: false, isExpired: false , nftImg:"assets/common/c4.png", nftDetail:"16 common NFT'S will be given away, Among which 8 will be given to the top 8 contributors and 8 will be given away to 8 random addresses."},
            { id: 9, name: '6000', type: SlotType.Fixed, color: '#6610f2', isSelected: false, isExpired: false , nftImg:"assets/common/c5.png", nftDetail:"16 common NFT'S will be given away, Among which 8 will be given to the top 8 contributors and 8 will be given away to 8 random addresses"},
            { id: 10, name: '6000', type: SlotType.Fixed, color: '#6610f2', isSelected: false, isExpired: false , nftImg:"assets/rare/r2.png", nftDetail:"8 Rares NFT'S will be given away, Among which 4 will be given to the top 4 contributors and 4 will be given away to 4 random addresses"},
            { id: 11, name: '6000', type: SlotType.Fixed, color: '#6610f2', isSelected: false, isExpired: false , nftImg:"assets/rare/r3.png", nftDetail:"8 Rares NFT'S will be given away, Among which 4 will be given to the top 4 contributors and 4 will be given away to 4 random addresses"},
            { id: 12, name: '6000', type: SlotType.Fixed, color: '#6610f2', isSelected: false, isExpired: false , nftImg:"assets/rare/r4.png", nftDetail:"8 Rares NFT'S will be given away, Among which 4 will be given to the top 4 contributors and 4 will be given away to 4 random addresses"},
            { id: 13, name: '6000', type: SlotType.Fixed, color: '#6610f2', isSelected: false, isExpired: false , nftImg:"assets/rare/r5.png", nftDetail:"16 Rares NFT'S will be given away, Among which 8 will be given to the top 8 contributors and 8 will be given away to 8 random addresses"},
            { id: 14, name: '6000', type: SlotType.Fixed, color: '#6610f2', isSelected: false, isExpired: false , nftImg:"assets/common/c6.png", nftDetail:"16 common NFT'S will be given away, Among which 8 will be given to the top 8 contributors and 8 will be given away to 8 random addresses"},
            { id: 15, name: '6000', type: SlotType.Fixed, color: '#6610f2', isSelected: false, isExpired: false , nftImg:"assets/legend/l3.png", nftDetail:"4 Legendary NFT'S will be given away, Among which 2 will be given to the top 2 contributors and 2 will be given away to 2 random addresse"},
            { id: 16, name: '6000', type: SlotType.Fixed, color: '#6610f2', isSelected: false, isExpired: false , nftImg:"assets/legend/l4.png", nftDetail:"4 Legendary NFT'S will be given away, Among which 2 will be given to the top 2 contributors and 2 will be given away to 2 random addresses"},
            { id: 17, name: '6000', type: SlotType.Fixed, color: '#6610f2', isSelected: false, isExpired: false , nftImg:"assets/common/c7.png", nftDetail:"16 common NFT'S will be given away, Among which 8 will be given to the top 8 contributors and 8 will be given away to 8 random addresses. "},
            { id: 18, name: '6000', type: SlotType.Fixed, color: '#6610f2', isSelected: false, isExpired: false , nftImg:"assets/common/c8.png", nftDetail:"16 common NFT'S will be given away, Among which 8 will be given to the top 8 contributors and 8 will be given away to 8 random addresses"},
            { id: 19, name: '6000', type: SlotType.Fixed, color: '#6610f2', isSelected: false, isExpired: false , nftImg:"assets/common/c1.png", nftDetail:"16 common NFT'S will be given away, Among which 8 will be given to the top 8 contributors and 8 will be given away to 8 random addresses"},
            { id: 20, name: '6000', type: SlotType.Fixed, color: '#6610f2', isSelected: false, isExpired: false , nftImg:"assets/common/c2.png", nftDetail:"16 common NFT'S will be given away, Among which 8 will be given to the top 8 contributors and 8 will be given away to 8 random addresses. "},
            { id: 21, name: '6000', type: SlotType.Fixed, color: '#6610f2', isSelected: false, isExpired: false , nftImg:"assets/rare/r6.png", nftDetail:"8 Rares NFT'S will be given away, Among which 4 will be given to the top 4 contributors and 4 will be given away to 4 random addresses"},
            { id: 22, name: '6000', type: SlotType.Fixed, color: '#6610f2', isSelected: false, isExpired: false , nftImg:"assets/rare/r1.png", nftDetail:"8 Rares NFT'S will be given away, Among which 4 will be given to the top 4 contributors and 4 will be given away to 4 random addresses"},
            { id: 23, name: '6000', type: SlotType.Fixed, color: '#6610f2', isSelected: false, isExpired: false , nftImg:"assets/rare/r2.png", nftDetail:"8 Rares NFT'S will be given away, Among which 4 will be given to the top 4 contributors and 4 will be given away to 4 random addresses"},
            { id: 25, name: '6000', type: SlotType.Fixed, color: '#6610f2', isSelected: false, isExpired: false , nftImg:"assets/mythic/mythic.png", nftDetail:"2 Mythic NFT'S will be given away, Among which 1 will be given to the highest contributor and 1 will be give away to a random address."},
            { id: 24, name: '6000', type: SlotType.Fixed, color: '#6610f2', isSelected: false, isExpired: false , nftImg:"assets/legend/l1.png", nftDetail:"4 Legendary NFT'S will be given away, Among which 2 will be given to the top 2 contributors and 2 will be given away to 2 random addresses. "},
            { id: 26, name: '6000', type: SlotType.Fixed, color: '#6610f2', isSelected: false, isExpired: false , nftImg:"assets/legend/l2.png", nftDetail:"4 Legendary NFT'S will be given away, Among which 2 will be given to the top 2 contributors and 2 will be given away to 2 random addresse"},
            { id: 27, name: '6000', type: SlotType.Fixed, color: '#6610f2', isSelected: false, isExpired: false , nftImg:"assets/common/c3.png", nftDetail:"16 common NFT'S will be given away, Among which 8 will be given to the top 8 contributors and 8 will be given away to 8 random addresse"},
            { id: 28, name: '6000', type: SlotType.Fixed, color: '#6610f2', isSelected: false, isExpired: false , nftImg:"assets/common/c4.png", nftDetail:"16 common NFT'S will be given away, Among which 8 will be given to the top 8 contributors and 8 will be given away to 8 random addresse"},
            { id: 29, name: '6000', type: SlotType.Fixed, color: '#6610f2', isSelected: false, isExpired: false , nftImg:"assets/common/c5.png", nftDetail:"16 common NFT'S will be given away, Among which 8 will be given to the top 8 contributors and 8 will be given away to 8 random addresses"},
            { id: 30, name: '6000', type: SlotType.Fixed, color: '#6610f2', isSelected: false, isExpired: false , nftImg:"assets/common/c6.png", nftDetail:"16 common NFT'S will be given away, Among which 8 will be given to the top 8 contributors and 8 will be given away to 8 random addresses"},
            { id: 31, name: '6000', type: SlotType.Fixed, color: '#6610f2', isSelected: false, isExpired: false , nftImg:"assets/rare/r3.png", nftDetail:"8 Rares NFT'S will be given away, Among which 4 will be given to the top 4 contributors and 4 will be given away to 4 random addresses. "},
            { id: 32, name: '6000', type: SlotType.Fixed, color: '#6610f2', isSelected: false, isExpired: false , nftImg:"assets/rare/r4.png", nftDetail:"8 Rares NFT'S will be given away, Among which 4 will be given to the top 4 contributors and 4 will be given away to 4 random addresses"},
            { id: 33, name: '6000', type: SlotType.Fixed, color: '#6610f2', isSelected: false, isExpired: false , nftImg:"assets/rare/r5.png", nftDetail:"8 Rares NFT'S will be given away, Among which 4 will be given to the top 4 contributors and 4 will be given away to 4 random addresses"},
            { id: 34, name: '6000', type: SlotType.Fixed, color: '#6610f2', isSelected: false, isExpired: false , nftImg:"assets/rare/r6.png", nftDetail:"8 Rares NFT'S will be given away, Among which 4 will be given to the top 4 contributors and 4 will be given away to 4 random addresses"},
            { id: 35, name: '6000', type: SlotType.Fixed, color: '#6610f2', isSelected: false, isExpired: false , nftImg:"assets/legend/l3.png", nftDetail:"4 Legendary NFT'S will be given away, Among which 2 will be given to the top 2 contributors and 2 will be given away to 2 random addresses"},
            { id: 36, name: '6000', type: SlotType.Fixed, color: '#6610f2', isSelected: false, isExpired: false , nftImg:"assets/legend/l4.png", nftDetail:"4 Legendary NFT'S will be given away, Among which 2 will be given to the top 2 contributors and 2 will be given away to 2 random addresses. "},
            { id: 37, name: '6000', type: SlotType.Fixed, color: '#6610f2', isSelected: false, isExpired: false , nftImg:"assets/common/c7.png", nftDetail:"16 common NFT'S will be given away, Among which 8 will be given to the top 8 contributors and 8 will be given away to 8 random addresses"},
            { id: 38, name: '6000', type: SlotType.Fixed, color: '#6610f2', isSelected: false, isExpired: false , nftImg:"assets/common/c8.png", nftDetail:"16 common NFT'S will be given away, Among which 8 will be given to the top 8 contributors and 8 will be given away to 8 random addresses"},
            { id: 39, name: '6000', type: SlotType.Fixed, color: '#6610f2', isSelected: false, isExpired: false , nftImg:"assets/common/c1.png", nftDetail:"16 common NFT'S will be given away, Among which 8 will be given to the top 8 contributors and 8 will be given away to 8 random addresses"},
            { id: 40, name: '6000', type: SlotType.Fixed, color: '#6610f2', isSelected: false, isExpired: false , nftImg:"assets/common/c2.png", nftDetail:"16 common NFT'S will be given away, Among which 8 will be given to the top 8 contributors and 8 will be given away to 8 random addresses"},
            { id: 41, name: '6000', type: SlotType.Fixed, color: '#6610f2', isSelected: false, isExpired: false , nftImg:"assets/common/c3.png", nftDetail:"16 common NFT'S will be given away, Among which 8 will be given to the top 8 contributors and 8 will be given away to 8 random addresses."},
            { id: 42, name: '6000', type: SlotType.Fixed, color: '#6610f2', isSelected: false, isExpired: false , nftImg:"assets/common/c4.png", nftDetail:"16 common NFT'S will be given away, Among which 8 will be given to the top 8 contributors and 8 will be given away to 8 random addresses"},
            { id: 43, name: '6000', type: SlotType.Fixed, color: '#6610f2', isSelected: false, isExpired: false , nftImg:"assets/common/c5.png", nftDetail:"16 common NFT'S will be given away, Among which 8 will be given to the top 8 contributors and 8 will be given away to 8 random addresses"},
            { id: 44, name: '6000', type: SlotType.Fixed, color: '#6610f2', isSelected: false, isExpired: false , nftImg:"assets/common/c6.png", nftDetail:"16 common NFT'S will be given away, Among which 8 will be given to the top 8 contributors and 8 will be given away to 8 random addresses. "},
            { id: 45, name: '6000', type: SlotType.Fixed, color: '#6610f2', isSelected: false, isExpired: false , nftImg:"assets/rare/r1.png", nftDetail:"8 Rares NFT'S will be given away, Among which 4 will be given to the top 4 contributors and 4 will be given away to 4 random addresses"},
            { id: 46, name: '6000', type: SlotType.Fixed, color: '#6610f2', isSelected: false, isExpired: false , nftImg:"assets/rare/r2.png", nftDetail:"8 Rares NFT'S will be given away, Among which 4 will be given to the top 4 contributors and 4 will be given away to 4 random addresses"},
            { id: 47, name: '6000', type: SlotType.Fixed, color: '#6610f2', isSelected: false, isExpired: false , nftImg:"assets/rare/r3.png", nftDetail:"8 Rares NFT'S will be given away, Among which 4 will be given to the top 4 contributors and 4 will be given away to 4 random addresses"},
            { id: 48, name: '6000', type: SlotType.Fixed, color: '#6610f2', isSelected: false, isExpired: false , nftImg:"assets/legend/l1.png", nftDetail:"4 Legendary NFT'S will be given away, Among which 2 will be given to the top 2 contributors and 2 will be given away to 2 random addresses"},
            { id: 49, name: '6000', type: SlotType.Fixed, color: '#6610f2', isSelected: false, isExpired: false , nftImg:"assets/legend/l2.png", nftDetail:"4 Legendary NFT'S will be given away, Among which 2 will be given to the top 2 contributors and 2 will be given away to 2 random addresses. "},
            { id: 50, name: '6000', type: SlotType.Fixed, color: '#6610f2', isSelected: false, isExpired: false , nftImg:"assets/mythic/mythic.png", nftDetail: "2 Mythic NFT'S will be given away, Among which 1 will be given to the highest contributor and 1 will be give away to a random address. "}
        ];

        let start = moment(startdate);
        start = start.add(start.hours() * -1, 'hours');
        this.allSlots.forEach(slot => {
            const slotStartDate = new Date(this.startTime + ((1000 * 60 * 60 * this.localDataUpdateService.slotMaxHours) * (slot.id - 1)));
            const slotEndDate = new Date(this.startTime + ((1000 * 60 * 60 * this.localDataUpdateService.slotMaxHours) * (slot.id)));

            let end = moment(slotStartDate);
            end = end.add(end.hours() * -1, 'hours');
            const diffDays = end.diff(start, 'days') + 1;

            slot.day = diffDays;
            slot.startDate = slotStartDate;
            slot.endDate = slotEndDate;
            slot.hours = this.localDataUpdateService.slotMaxHours;
            // slot.option = ' #46494f';
            slot.progressDone = 0;
        });
    }

    updateSlotsTimer() {
        this.intervalId = setInterval(() => {
            this.allSlots.forEach(slot => {
                if (slot.timeLeft != 'EXPIRED' && !slot.isExpired) {
                    slot.timeLeft = this.getTimeLeft(slot.endDate?.getTime());
                    slot.progressDone = this.getCurrentTimeProgess(slot.startDate?.getTime(), slot.endDate?.getTime());
                }
                if (slot.timeLeft == 'EXPIRED') {
                    slot.isExpired = true;
                }
                if (slot.id == this.localDataUpdateService.totalSlots && slot.isExpired) {
                    clearInterval(this.intervalId);
                }
            });
        }, 1000);
    }

    stopSlotsTimer() {
        clearInterval(this.intervalId);
    }

    updateSlotsReservation() {
        this.allSlots.forEach(slot => {
            this.liquidityContractService.getGriseReservationData(slot.id).then(griseReservationData => {
                if (griseReservationData) {
                    slot.slotLeft = this.localDataUpdateService.maxSlotsPerSlot - griseReservationData.slotsUsed;
                    slot.totalInvest = griseReservationData.totalInvestment;
                    slot.myContribution = griseReservationData.myContribution;
                    // slot.mySharePercent = (slot.myContribution == 0) ? 0 : (slot.myContribution / slot.totalInvest) * 100;
                    slot.mySharePercent = (slot.myContribution == 0) ? "0 %" : (griseReservationData.myShare == 0) ? ((slot.myContribution / slot.totalInvest) * 100).toFixed(2).concat(" %") : (griseReservationData.myShare).toFixed(2).concat(" GRISE");
                }
            });
        });

        this.liquidityContractService.getSupplyOnAllDays().then(allDaysdata => {
            if (allDaysdata) {
                allDaysdata.forEach((allDaydata, index) => {
                    if (allDaydata > 0) {
                        this.allSlots[index - 1].name = allDaydata.toString();
                    }
                });
            }
        });
    }

    deselectAllSlots() {
        this.allSlots.forEach(slot => {
            slot.isSelected = false;
        });
    }

    initPersonalPeriodStakes() {
        this.allPersonalPeriodStakes = [
            { periodType: 'W', additionalValue: '', stakeStep: 50, slotLeft: 0 },
            { periodType: 'M', additionalValue: '3', stakeStep: 225, slotLeft: 0 },
            { periodType: 'M', additionalValue: '6', stakeStep: 100, slotLeft: 0 },
            { periodType: 'M', additionalValue: '9', stakeStep: 150, slotLeft: 0 },
            { periodType: 'Y', additionalValue: '', stakeStep: 100, slotLeft: 0 }
        ];
    }

    updatePersonalPeriodStakeSlotLeft() {
        this.stakingTokenContractService.getStakeSlotsLeftData().then(slotLefts => {
            if (slotLefts) {
                this.allPersonalPeriodStakes.forEach(stakes => {
                    switch (stakes.periodType + stakes.additionalValue) {
                        case 'W': { stakes.slotLeft = slotLefts.stSlotLeft; break; }
                        case 'M3': { stakes.slotLeft = slotLefts.mt3MonthSlotLeft; break; }
                        case 'M6': { stakes.slotLeft = slotLefts.mt6MonthSlotLeft; break; }
                        case 'M9': { stakes.slotLeft = slotLefts.mt9MonthSlotLeft; break; }
                        case 'Y': { stakes.slotLeft = slotLefts.ltSlotLeft; break; }
                    }
                });
                this.localDataUpdateService.forceUpdatePersonalPeriodStakeSlotLeftData(true);
            }
        });
    }

    getDateAdd(fromDt: number, days?: number): Date {
        return moment(new Date(fromDt)).add(days, 'days').toDate();
    }

    getDateNumberDiff(fromDt: number, toDt: number): number {
        return this.getDateDiff(new Date(fromDt), new Date(toDt));
    }

    getDateDiff(fromDt: Date, toDt: Date): number {
        const fromDate = moment(fromDt);
        const toDate = moment(toDt);
        return toDate.diff(fromDate, 'days') + 1;
    }

    getDateWithoutTime(fromDt: Date): Date {
        fromDt.setHours(0);
        fromDt.setMinutes(0);
        fromDt.setSeconds(0);
        fromDt.setMilliseconds(0);
        return fromDt;
    }
}
