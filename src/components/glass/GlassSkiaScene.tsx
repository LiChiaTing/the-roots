import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  Canvas,
  Group,
  Fill,
  RoundedRect,
  Circle,
  LinearGradient,
  RadialGradient,
  Blur,
  BackdropFilter,
  BoxShadow,
  vec,
  rect,
  rrect,
} from '@shopify/react-native-skia';

/**
 * Liquid-glass scene rendered with React Native Skia (same engine class
 * as Flutter). The colored blobs are painted first; each glass element
 * then uses a real BackdropFilter blur so it genuinely refracts the
 * blobs behind it. Depth comes from Skia BoxShadow (outer + inner) —
 * the inset highlights React Native could not do. Text/icons are RN
 * views laid over the matching rects.
 */
export default function GlassSkiaScene() {
  const { width, height } = useWindowDimensions();
  const PAD = 28;
  const W = width;

  const colW = Math.min(W - PAD * 2, 360);

  // ---- geometry (shared by Skia shapes + RN overlays) ----
  const btnH = 56;
  const pillR = btnH / 2;
  const b1 = { x: PAD, y: 150, w: 156, h: btnH };
  const b2 = { x: PAD + 156 + 16, y: 150, w: 150, h: btnH };

  const cardR = 26;
  const card = { x: PAD, y: 256, w: colW, h: 232 };

  // subscribe pill inside the card
  const subH = 46;
  const sub = {
    x: card.x + 22,
    y: card.y + card.h - 22 - subH,
    w: 150,
    h: subH,
  };

  const H = Math.max(height, card.y + card.h + 80);

  return (
    <View style={{ flex: 1, backgroundColor: '#EFEEF6' }}>
      <Canvas style={{ position: 'absolute', width: W, height: H }}>
        {/* base wash */}
        <Fill>
          <LinearGradient
            start={vec(0, 0)}
            end={vec(0, H)}
            colors={['#EFEEF6', '#ECEDF4', '#E9EEF1']}
          />
        </Fill>

        {/* iridescent blobs — the light the glass will refract.
            Positioned (in px) to sit right behind the glass column so
            the buttons/card visibly pick up the color. */}
        <Group>
          {/* purple — behind the buttons */}
          <Circle cx={130} cy={165} r={190}>
            <RadialGradient
              c={vec(130, 165)}
              r={190}
              colors={['rgba(192,160,255,0.98)', 'rgba(192,160,255,0)']}
            />
          </Circle>
          {/* teal — behind the card */}
          <Circle cx={150} cy={card.y + 120} r={210}>
            <RadialGradient
              c={vec(150, card.y + 120)}
              r={210}
              colors={['rgba(140,236,202,0.92)', 'rgba(140,236,202,0)']}
            />
          </Circle>
          {/* peach — warm accent through the card's lower-right */}
          <Circle cx={card.x + card.w - 30} cy={card.y + 60} r={170}>
            <RadialGradient
              c={vec(card.x + card.w - 30, card.y + 60)}
              r={170}
              colors={['rgba(255,190,162,0.8)', 'rgba(255,190,162,0)']}
            />
          </Circle>
          {/* faint ambient lilac, top-right of the screen */}
          <Circle cx={W * 0.82} cy={90} r={180}>
            <RadialGradient
              c={vec(W * 0.82, 90)}
              r={180}
              colors={['rgba(204,180,255,0.6)', 'rgba(204,180,255,0)']}
            />
          </Circle>
          <Blur blur={55} />
        </Group>

        {/* ============ CARD ============ */}
        <BackdropFilter
          filter={<Blur blur={12} />}
          clip={rrect(rect(card.x, card.y, card.w, card.h), cardR, cardR)}
        />
        <RoundedRect
          x={card.x}
          y={card.y}
          width={card.w}
          height={card.h}
          r={cardR}
          color="rgba(255,255,255,0.34)"
        >
          <BoxShadow dx={0} dy={20} blur={44} color="rgba(150,140,210,0.32)" />
          <BoxShadow dx={0} dy={2} blur={3} color="rgba(255,255,255,0.95)" inner />
          <BoxShadow dx={0} dy={-14} blur={22} color="rgba(186,172,244,0.22)" inner />
        </RoundedRect>
        <RoundedRect
          x={card.x}
          y={card.y}
          width={card.w}
          height={card.h}
          r={cardR}
          style="stroke"
          strokeWidth={1.5}
          color="rgba(255,255,255,0.85)"
        />

        {/* ============ BUTTON 1 — purple ============ */}
        <BackdropFilter
          filter={<Blur blur={8} />}
          clip={rrect(rect(b1.x, b1.y, b1.w, b1.h), pillR, pillR)}
        />
        <RoundedRect x={b1.x} y={b1.y} width={b1.w} height={b1.h} r={pillR}>
          <LinearGradient
            start={vec(b1.x, b1.y)}
            end={vec(b1.x, b1.y + b1.h)}
            colors={['rgba(247,244,255,0.7)', 'rgba(206,188,253,0.55)']}
          />
          <BoxShadow dx={0} dy={12} blur={22} color="rgba(168,140,250,0.6)" />
          <BoxShadow dx={0} dy={2} blur={2} color="rgba(255,255,255,0.95)" inner />
          <BoxShadow dx={0} dy={-9} blur={14} color="rgba(176,150,252,0.55)" inner />
        </RoundedRect>
        <RoundedRect
          x={b1.x}
          y={b1.y}
          width={b1.w}
          height={b1.h}
          r={pillR}
          style="stroke"
          strokeWidth={1.5}
          color="rgba(255,255,255,0.9)"
        />

        {/* ============ BUTTON 2 — teal ============ */}
        <BackdropFilter
          filter={<Blur blur={8} />}
          clip={rrect(rect(b2.x, b2.y, b2.w, b2.h), pillR, pillR)}
        />
        <RoundedRect x={b2.x} y={b2.y} width={b2.w} height={b2.h} r={pillR}>
          <LinearGradient
            start={vec(b2.x, b2.y)}
            end={vec(b2.x, b2.y + b2.h)}
            colors={['rgba(242,255,251,0.7)', 'rgba(184,238,214,0.55)']}
          />
          <BoxShadow dx={0} dy={12} blur={22} color="rgba(110,220,180,0.55)" />
          <BoxShadow dx={0} dy={2} blur={2} color="rgba(255,255,255,0.95)" inner />
          <BoxShadow dx={0} dy={-9} blur={14} color="rgba(150,228,196,0.6)" inner />
        </RoundedRect>
        <RoundedRect
          x={b2.x}
          y={b2.y}
          width={b2.w}
          height={b2.h}
          r={pillR}
          style="stroke"
          strokeWidth={1.5}
          color="rgba(255,255,255,0.9)"
        />

        {/* ============ SUBSCRIBE pill (inside card) — teal ============ */}
        <BackdropFilter
          filter={<Blur blur={8} />}
          clip={rrect(rect(sub.x, sub.y, sub.w, sub.h), subH / 2, subH / 2)}
        />
        <RoundedRect x={sub.x} y={sub.y} width={sub.w} height={sub.h} r={subH / 2}>
          <LinearGradient
            start={vec(sub.x, sub.y)}
            end={vec(sub.x, sub.y + sub.h)}
            colors={['rgba(242,255,251,0.72)', 'rgba(184,238,214,0.55)']}
          />
          <BoxShadow dx={0} dy={10} blur={18} color="rgba(110,220,180,0.5)" />
          <BoxShadow dx={0} dy={2} blur={2} color="rgba(255,255,255,0.95)" inner />
          <BoxShadow dx={0} dy={-8} blur={12} color="rgba(150,228,196,0.6)" inner />
        </RoundedRect>
        <RoundedRect
          x={sub.x}
          y={sub.y}
          width={sub.w}
          height={sub.h}
          r={subH / 2}
          style="stroke"
          strokeWidth={1.4}
          color="rgba(255,255,255,0.9)"
        />
      </Canvas>

      {/* ---------------- RN overlay: text + icons ---------------- */}
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <Text style={[styles.title, { left: PAD, top: 60 }]}>Liquid Glass Kit</Text>

        <View style={[styles.center, abs(b1)]}>
          <Text style={styles.btnLabel}>Start project</Text>
        </View>
        <View style={[styles.center, abs(b2)]}>
          <Text style={styles.btnLabel}>Secondary</Text>
        </View>

        {/* card content */}
        <View style={[abs(card), { padding: 22 }]}>
          <View style={styles.cardHeader}>
            <View style={styles.dot} />
            <Text style={styles.cardTitle}>Modal</Text>
            <Ionicons
              name="add"
              size={20}
              color="#6A6A78"
              style={{ marginLeft: 'auto' }}
            />
          </View>
          <Text style={styles.cardBody}>
            Real frosted glass — it blurs and refracts the colored light
            behind it, with inner highlights for depth.
          </Text>
        </View>

        <View style={[styles.center, abs(sub)]}>
          <Text style={styles.btnLabel}>Subscribe</Text>
        </View>

        <Text style={[styles.note, { top: card.y + card.h + 28, width: '100%' }]}>
          Rendered with React Native Skia · {Platform.OS}
        </Text>
      </View>
    </View>
  );
}

const abs = (r: { x: number; y: number; w: number; h: number }) => ({
  position: 'absolute' as const,
  left: r.x,
  top: r.y,
  width: r.w,
  height: r.h,
});

const styles = StyleSheet.create({
  title: {
    position: 'absolute',
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 26,
    color: '#26262E',
  },
  center: { alignItems: 'center', justifyContent: 'center' },
  btnLabel: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 16,
    color: '#1A1A22',
    letterSpacing: 0.2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  dot: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#F2A93B' },
  cardTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 18,
    color: '#26262E',
  },
  cardBody: {
    fontFamily: 'NotoSans_400Regular',
    fontSize: 14,
    lineHeight: 21,
    color: '#4C4C57',
  },
  note: {
    position: 'absolute',
    textAlign: 'center',
    fontFamily: 'NotoSans_400Regular',
    fontSize: 12,
    color: '#9A9AA8',
  },
});
