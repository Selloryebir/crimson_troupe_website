import assert from 'node:assert/strict';

export function assertSeatingPlanRegistry(plans, ticketZones) {
  for (const [seatingPlanId, plan] of Object.entries(plans)) {
    assert.equal(plan.seatingPlanId, seatingPlanId, `${seatingPlanId} 的稳定 ID 与注册键不一致`);
    assert.ok(plan.levels.length > 0, `${seatingPlanId} 至少需要一个楼层`);
    const levelIds = plan.levels.map(({ levelId }) => levelId);
    const regions = plan.levels.flatMap(({ regions: levelRegions }) => levelRegions);
    const regionIds = regions.map(({ regionId }) => regionId);
    assert.equal(new Set(levelIds).size, levelIds.length, `${seatingPlanId} 的楼层身份重复`);
    assert.ok(regions.length > 0, `${seatingPlanId} 至少需要一个空间区域`);
    assert.equal(new Set(regionIds).size, regionIds.length, `${seatingPlanId} 的空间区域身份重复`);
    for (const region of regions) {
      assert.ok(
        Object.hasOwn(ticketZones, region.zone),
        `${seatingPlanId}.${region.regionId} 使用未知分区 ${region.zone}`,
      );
    }
  }
}

export function assertTicketingCapabilities(performances, seatingPlans) {
  for (const performance of Object.values(performances)) {
    const ticketing = performance.ticketAvailability;
    if (performance.world === 'archive' && performance.status === 'completed') {
      assert.equal(
        ticketing.state,
        'not-on-sale',
        `${performance.performanceId} 已闭幕，不得保持开放登记`,
      );
    }
    if (performance.world === 'archive' && ticketing.state === 'on-sale') {
      assert.equal(
        ticketing.seatingPlanId,
        undefined,
        `${performance.performanceId} 不应为静态登记虚构表站场馆图`,
      );
      assert.ok(ticketing.offers.length > 0, `${performance.performanceId} 缺少静态登记分区`);
      assert.equal(
        new Set(ticketing.offers.map(({ zone }) => zone)).size,
        ticketing.offers.length,
        `${performance.performanceId} 的登记分区重复`,
      );
    }
    if (performance.world !== 'front' || ticketing.state !== 'on-sale') continue;

    assert.ok(ticketing.seatingPlanId, `${performance.performanceId} 缺少表站分区示意`);
    const plan = seatingPlans[ticketing.seatingPlanId];
    assert.ok(plan, `${performance.performanceId} 引用未知分区示意`);
    const regions = plan.levels.flatMap(({ regions: levelRegions }) => levelRegions);
    const planZones = [...new Set(regions.map(({ zone }) => zone))].sort();
    const offerZones = ticketing.offers.map(({ zone }) => zone).sort();
    assert.deepEqual(planZones, offerZones, `${performance.performanceId} 的示意分区与报价不一致`);
    assert.equal(
      new Set(ticketing.offers.map(({ basePrice }) => basePrice)).size,
      ticketing.offers.length,
      `${performance.performanceId} 的候选分区价格应逐级区分`,
    );
  }
}

const yaneseLanguagePatterns = {
  yan: /炎语|中文|中维/u,
  victoria: /Yanese/u,
  columbia: /Yanese/u,
  higashi: /炎語/u,
  ursus: /янском/u,
  siracusa: /yanese/u,
  minos: /Yanese/u,
  leithanien: /yanesisch/iu,
  kazimierz: /yanese/u,
};

export function assertYaneseServiceLanguage(samples) {
  for (const [editionId, pattern] of Object.entries(yaneseLanguagePatterns)) {
    assert.match(samples[editionId], pattern, `${editionId} 不得改变字幕或场序单的炎语语种`);
  }
}
