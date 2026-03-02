import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import useWebViewBridge from '../../src/hooks/useWebViewBridge';
import { WebViewAction } from '../../src/types';

// lodash debounce를 즉시 실행으로 대체
jest.mock('lodash', () => ({
  debounce: (fn: Function) => {
    const debounced = (...args: any[]) => fn(...args);
    debounced.cancel = jest.fn();
    debounced.flush = jest.fn();
    return debounced;
  },
  isEqual: jest.requireActual('lodash').isEqual,
}));

// react-test-renderer 기반 renderHook 구현
function renderHook<P extends Record<string, any>, T>(
  hookFn: (props: P) => T,
  options?: { initialProps: P },
) {
  const results = { current: undefined as unknown as T };

  function TestComponent({ hookProps }: { hookProps: P }) {
    results.current = hookFn(hookProps);
    return null;
  }

  let renderer: ReactTestRenderer.ReactTestRenderer;
  ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      React.createElement(TestComponent, {
        hookProps: (options?.initialProps ?? {}) as P,
      }),
    );
  });

  return {
    result: results,
    rerender: (newProps: P) => {
      ReactTestRenderer.act(() => {
        renderer!.update(
          React.createElement(TestComponent, { hookProps: newProps }),
        );
      });
    },
    unmount: () => renderer!.unmount(),
  };
}

const mockWebViewRef = (postMessage = jest.fn()) => ({
  current: { postMessage } as any,
});

const nullRef = () => ({ current: null });

describe('useWebViewBridge', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── 기본 동작 ───

  describe('기본 메시지 전송', () => {
    it('WebView 준비 상태에서 메시지를 전송해야 한다', () => {
      const postMessage = jest.fn();
      const ref = mockWebViewRef(postMessage);

      const { result } = renderHook(
        (props: { ref: typeof ref; ready: boolean }) =>
          useWebViewBridge(props.ref, props.ready),
        { initialProps: { ref, ready: true } },
      );

      ReactTestRenderer.act(() => {
        result.current('ADD_ITEM' as WebViewAction, { id: 'test' });
      });

      expect(postMessage).toHaveBeenCalledWith(
        JSON.stringify({ action: 'ADD_ITEM', data: { id: 'test' } }),
      );
    });

    it('반환된 함수가 함수 타입이어야 한다', () => {
      const ref = mockWebViewRef();
      const { result } = renderHook(
        (props: { ref: typeof ref; ready: boolean }) =>
          useWebViewBridge(props.ref, props.ready),
        { initialProps: { ref, ready: true } },
      );

      expect(typeof result.current).toBe('function');
    });
  });

  // ─── 큐잉 동작 ───

  describe('메시지 큐잉', () => {
    it('WebView 미준비 시 메시지가 전송되지 않아야 한다', () => {
      const postMessage = jest.fn();
      const ref = mockWebViewRef(postMessage);

      const { result } = renderHook(
        (props: { ref: typeof ref; ready: boolean }) =>
          useWebViewBridge(props.ref, props.ready),
        { initialProps: { ref, ready: false } },
      );

      ReactTestRenderer.act(() => {
        result.current('ADD_ITEM' as WebViewAction, { id: '1' });
        result.current('ADD_ITEM' as WebViewAction, { id: '2' });
      });

      expect(postMessage).not.toHaveBeenCalled();
    });

    it('WebView가 준비되면 큐에 있던 메시지가 전송되어야 한다', () => {
      const postMessage = jest.fn();
      const ref = mockWebViewRef(postMessage);

      const { result, rerender } = renderHook(
        (props: { ref: typeof ref; ready: boolean }) =>
          useWebViewBridge(props.ref, props.ready),
        { initialProps: { ref, ready: false } },
      );

      // 미준비 상태에서 메시지 큐잉
      ReactTestRenderer.act(() => {
        result.current('ADD_ITEM' as WebViewAction, { id: '1' });
      });

      expect(postMessage).not.toHaveBeenCalled();

      // 준비 상태로 전환
      rerender({ ref, ready: true });

      // 큐에 있던 메시지가 전송됨
      expect(postMessage).toHaveBeenCalled();
    });

    it('ref.current가 null이면 에러 없이 큐에 쌓여야 한다', () => {
      const ref = nullRef();

      const { result } = renderHook(
        (props: { ref: typeof ref; ready: boolean }) =>
          useWebViewBridge(props.ref, props.ready),
        { initialProps: { ref, ready: true } },
      );

      // 에러가 발생하지 않아야 한다
      expect(() => {
        ReactTestRenderer.act(() => {
          result.current('ADD_ITEM' as WebViewAction, { id: '1' });
        });
      }).not.toThrow();
    });
  });

  // ─── 큐 오버플로우 ───

  describe('큐 오버플로우 (MAX_QUEUE_LENGTH=10)', () => {
    it('큐가 10개를 초과하면 가장 오래된 메시지가 제거되어야 한다', () => {
      const postMessage = jest.fn();
      const ref = mockWebViewRef(postMessage);

      const { result, rerender } = renderHook(
        (props: { ref: typeof ref; ready: boolean }) =>
          useWebViewBridge(props.ref, props.ready),
        { initialProps: { ref, ready: false } },
      );

      // 11개 메시지 큐잉
      ReactTestRenderer.act(() => {
        for (let i = 0; i < 11; i++) {
          result.current('ADD_ITEM' as WebViewAction, { id: `item-${i}` });
        }
      });

      // 준비 상태로 전환하여 큐 flush
      rerender({ ref, ready: true });

      // 10번 호출되어야 함 (MAX_QUEUE_LENGTH = 10)
      expect(postMessage).toHaveBeenCalledTimes(10);

      // 첫 번째 전송은 item-1이어야 (item-0은 shift로 제거됨)
      const firstSent = JSON.parse(postMessage.mock.calls[0][0]);
      expect(firstSent.data.id).toBe('item-1');
    });
  });
});
