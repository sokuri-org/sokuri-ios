import { Bag } from '../../src/types';

/**
 * AddItemModal의 유효성 검증 로직을 추출한 순수 함수
 * 원본 컴포넌트의 handleAdd() 내부 로직과 동일한 검증 규칙
 */
function validateAddItem(
  input: { width: string; height: string; depth: string },
  bag: Bag | null,
): { valid: boolean; reason?: string } {
  const w = parseFloat(input.width);
  const h = parseFloat(input.height);
  const d = parseFloat(input.depth);

  if (!bag || isNaN(w) || isNaN(h) || isNaN(d) || w <= 0 || h <= 0 || d <= 0) {
    return { valid: false, reason: 'invalid_input' };
  }

  if (w > bag.width || h > bag.height || d > bag.depth) {
    return { valid: false, reason: 'exceeds_bag' };
  }

  return { valid: true };
}

/**
 * EditItemModal의 유효성 검증 로직 (현재 구현 재현)
 */
function validateEditItem(
  dims: { w: string; h: string; d: string },
): { valid: boolean; reason?: string } {
  const width = parseFloat(dims.w);
  const height = parseFloat(dims.h);
  const depth = parseFloat(dims.d);

  if (isNaN(width) || isNaN(height) || isNaN(depth)) {
    return { valid: false, reason: 'invalid_input' };
  }

  return { valid: true };
}

/**
 * EditBagModal의 유효성 검증 로직 (현재 구현 재현)
 */
function validateEditBag(
  input: { width: string; height: string; depth: string },
): { valid: boolean; reason?: string } {
  const w = parseFloat(input.width);
  const h = parseFloat(input.height);
  const d = parseFloat(input.depth);

  if (isNaN(w) || isNaN(h) || isNaN(d)) {
    return { valid: false, reason: 'invalid_input' };
  }

  return { valid: true };
}

/**
 * SizeSummaryCard의 유효성 검증 로직 (현재 구현 재현, 가장 엄격)
 */
function validateSizeSummaryBag(
  input: { width: string; height: string; depth: string },
): { valid: boolean; reason?: string } {
  const w = parseFloat(input.width);
  const h = parseFloat(input.height);
  const d = parseFloat(input.depth);

  if (isNaN(w) || isNaN(h) || isNaN(d) || w <= 0 || h <= 0 || d <= 0) {
    return { valid: false, reason: 'invalid_input' };
  }

  return { valid: true };
}

// ─── AddItemModal 유효성 검증 ───

describe('AddItemModal 유효성 검증', () => {
  const validBag: Bag = { width: 30, height: 40, depth: 20 };

  describe('정상 입력', () => {
    it('유효한 치수와 가방보다 작은 아이템은 통과해야 한다', () => {
      expect(
        validateAddItem({ width: '10', height: '20', depth: '5' }, validBag),
      ).toEqual({ valid: true });
    });

    it('가방과 정확히 같은 크기의 아이템은 통과해야 한다', () => {
      expect(
        validateAddItem({ width: '30', height: '40', depth: '20' }, validBag),
      ).toEqual({ valid: true });
    });
  });

  describe('잘못된 입력', () => {
    it('빈 문자열은 거부해야 한다', () => {
      const result = validateAddItem(
        { width: '', height: '', depth: '' },
        validBag,
      );
      expect(result.valid).toBe(false);
    });

    it('0 값은 거부해야 한다', () => {
      const result = validateAddItem(
        { width: '0', height: '10', depth: '5' },
        validBag,
      );
      expect(result.valid).toBe(false);
    });

    it('음수 값은 거부해야 한다', () => {
      const result = validateAddItem(
        { width: '-5', height: '10', depth: '5' },
        validBag,
      );
      expect(result.valid).toBe(false);
    });

    it('문자열 입력은 거부해야 한다', () => {
      const result = validateAddItem(
        { width: 'abc', height: '10', depth: '5' },
        validBag,
      );
      expect(result.valid).toBe(false);
    });
  });

  describe('가방 크기 초과', () => {
    it('너비가 가방보다 크면 거부해야 한다', () => {
      const result = validateAddItem(
        { width: '31', height: '10', depth: '5' },
        validBag,
      );
      expect(result.valid).toBe(false);
      expect(result.reason).toBe('exceeds_bag');
    });

    it('높이가 가방보다 크면 거부해야 한다', () => {
      const result = validateAddItem(
        { width: '10', height: '41', depth: '5' },
        validBag,
      );
      expect(result.valid).toBe(false);
    });
  });

  describe('가방 미설정', () => {
    it('bag이 null이면 거부해야 한다', () => {
      const result = validateAddItem(
        { width: '10', height: '10', depth: '5' },
        null,
      );
      expect(result.valid).toBe(false);
    });

    it('bag이 {0,0,0}(초기 상태)이면 모든 양수 아이템이 거부되어야 한다', () => {
      const zeroBag: Bag = { width: 0, height: 0, depth: 0 };
      const result = validateAddItem(
        { width: '1', height: '1', depth: '1' },
        zeroBag,
      );
      expect(result.valid).toBe(false);
      expect(result.reason).toBe('exceeds_bag');
    });
  });
});

// ─── EditItemModal 유효성 검증 ───

describe('EditItemModal 유효성 검증', () => {
  it('유효한 숫자 입력은 통과해야 한다', () => {
    expect(validateEditItem({ w: '10', h: '20', d: '5' })).toEqual({
      valid: true,
    });
  });

  it('NaN 입력은 거부해야 한다', () => {
    expect(validateEditItem({ w: 'abc', h: '20', d: '5' }).valid).toBe(false);
  });

  it('[버그 문서화] 음수 입력이 통과된다 (양수 검사 없음)', () => {
    // 현재 구현: isNaN만 체크하므로 음수(-5)가 통과됨
    const result = validateEditItem({ w: '-5', h: '20', d: '5' });
    expect(result.valid).toBe(true); // 이것은 버그
  });

  it('[버그 문서화] 0 입력이 통과된다 (양수 검사 없음)', () => {
    const result = validateEditItem({ w: '0', h: '20', d: '5' });
    expect(result.valid).toBe(true); // 이것은 버그
  });

  it('[버그 문서화] 가방보다 큰 치수로 수정이 가능하다 (bag 초과 검사 없음)', () => {
    // EditItemModal은 bag 크기 비교를 하지 않음
    const result = validateEditItem({ w: '9999', h: '9999', d: '9999' });
    expect(result.valid).toBe(true); // 이것은 버그
  });
});

// ─── EditBagModal 유효성 검증 ───

describe('EditBagModal 유효성 검증', () => {
  it('유효한 숫자 입력은 통과해야 한다', () => {
    expect(
      validateEditBag({ width: '30', height: '40', depth: '20' }),
    ).toEqual({ valid: true });
  });

  it('NaN 입력은 거부해야 한다', () => {
    expect(
      validateEditBag({ width: 'abc', height: '40', depth: '20' }).valid,
    ).toBe(false);
  });

  it('[버그 문서화] 0 또는 음수 가방 치수가 허용된다', () => {
    // EditBagModal은 isNaN만 체크, <= 0 체크 없음
    expect(
      validateEditBag({ width: '0', height: '-1', depth: '20' }).valid,
    ).toBe(true); // 이것은 버그
  });
});

// ─── SizeSummaryCard 유효성 검증 ───

describe('SizeSummaryCard 유효성 검증 (가장 엄격)', () => {
  it('유효한 양수 입력은 통과해야 한다', () => {
    expect(
      validateSizeSummaryBag({ width: '30', height: '40', depth: '20' }),
    ).toEqual({ valid: true });
  });

  it('0 값은 거부해야 한다', () => {
    expect(
      validateSizeSummaryBag({ width: '0', height: '40', depth: '20' }).valid,
    ).toBe(false);
  });

  it('음수 값은 거부해야 한다', () => {
    expect(
      validateSizeSummaryBag({ width: '-5', height: '40', depth: '20' }).valid,
    ).toBe(false);
  });
});
