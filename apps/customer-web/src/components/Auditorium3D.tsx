import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { SeatNode } from '../types';
import { formatCurrency } from '../utils/currency';

interface Auditorium3DProps {
  seats?: SeatNode[];
  selectedSeatCodes: string[];
  onToggleSeat: (seatCode: string) => void;
  interactive?: boolean;
  theme?: 'light' | 'dark';
  city?: string;
}

interface FanRowConfig {
  rowName: string;
  radius: number;
  y: number;
  tier: 'VIP Suite' | 'Premium' | 'Standard';
  category: 'VIP_SUITE' | 'PREMIUM' | 'STANDARD';
  price: number;
  leftSeats: number[];
  centerSeats: number[];
  rightSeats: number[];
  wheelchairSeats?: number[];
  isWalkwayBefore?: boolean;
}

const FAN_ROW_CONFIGS: FanRowConfig[] = [
  // Upper Elite Section (₹300 ELITE 3D / VIP Suite)
  {
    rowName: 'A',
    radius: 41.5,
    y: 15.5,
    tier: 'VIP Suite',
    category: 'VIP_SUITE',
    price: 35.0,
    leftSeats: [1, 2, 3, 4, 5],
    centerSeats: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    rightSeats: [19, 20, 21, 22, 23],
  },
  {
    rowName: 'B',
    radius: 39.8,
    y: 14.3,
    tier: 'VIP Suite',
    category: 'VIP_SUITE',
    price: 35.0,
    leftSeats: [1, 2, 3, 4, 5, 6],
    centerSeats: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
    rightSeats: [24, 25, 26, 27, 28, 29],
  },
  {
    rowName: 'C',
    radius: 38.1,
    y: 13.1,
    tier: 'VIP Suite',
    category: 'VIP_SUITE',
    price: 35.0,
    leftSeats: [1, 2, 3, 4, 5, 6],
    centerSeats: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
    rightSeats: [24, 25, 26, 27, 28, 29],
  },
  {
    rowName: 'D',
    radius: 36.4,
    y: 12.0,
    tier: 'VIP Suite',
    category: 'VIP_SUITE',
    price: 35.0,
    leftSeats: [1, 2, 3, 4, 5, 6],
    centerSeats: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
    rightSeats: [24, 25, 26, 27, 28, 29],
  },
  {
    rowName: 'E',
    radius: 34.7,
    y: 10.9,
    tier: 'VIP Suite',
    category: 'VIP_SUITE',
    price: 35.0,
    leftSeats: [1, 2, 3, 4, 5, 6],
    centerSeats: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
    rightSeats: [24, 25, 26, 27, 28, 29],
  },
  {
    rowName: 'F',
    radius: 33.0,
    y: 9.8,
    tier: 'VIP Suite',
    category: 'VIP_SUITE',
    price: 35.0,
    leftSeats: [1, 2, 3, 4, 5, 6],
    centerSeats: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
    rightSeats: [24, 25, 26, 27, 28, 29],
  },
  {
    rowName: 'G',
    radius: 31.3,
    y: 8.8,
    tier: 'VIP Suite',
    category: 'VIP_SUITE',
    price: 35.0,
    leftSeats: [1, 2, 3, 4, 5, 6],
    centerSeats: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
    rightSeats: [24, 25, 26, 27, 28, 29],
  },
  {
    rowName: 'H',
    radius: 29.6,
    y: 7.8,
    tier: 'VIP Suite',
    category: 'VIP_SUITE',
    price: 35.0,
    leftSeats: [1, 2, 3, 4, 5, 6],
    centerSeats: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
    rightSeats: [24, 25, 26, 27, 28, 29],
  },
  {
    rowName: 'J',
    radius: 27.9,
    y: 6.8,
    tier: 'VIP Suite',
    category: 'VIP_SUITE',
    price: 35.0,
    leftSeats: [1, 2, 3, 4, 5, 6],
    centerSeats: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
    rightSeats: [24, 25, 26, 27, 28, 29],
  },
  {
    rowName: 'K',
    radius: 26.2,
    y: 5.9,
    tier: 'VIP Suite',
    category: 'VIP_SUITE',
    price: 35.0,
    leftSeats: [1, 2, 3, 4, 5, 6],
    centerSeats: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
    rightSeats: [24, 25, 26, 27, 28, 29],
  },

  // Transverse Walkway Concourse Break between K and L

  // Lower Section (Rows L through T)
  {
    rowName: 'L',
    radius: 23.0,
    y: 4.8,
    tier: 'Premium',
    category: 'PREMIUM',
    price: 28.0,
    isWalkwayBefore: true,
    leftSeats: [1, 2],
    centerSeats: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    rightSeats: [19, 20, 21, 22, 23, 24],
  },
  {
    rowName: 'M',
    radius: 21.5,
    y: 4.0,
    tier: 'Premium',
    category: 'PREMIUM',
    price: 28.0,
    leftSeats: [1, 2],
    centerSeats: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    rightSeats: [19, 20, 21, 22, 23, 24],
  },
  {
    rowName: 'N',
    radius: 20.0,
    y: 3.3,
    tier: 'Premium',
    category: 'PREMIUM',
    price: 28.0,
    leftSeats: [1, 2],
    centerSeats: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
    rightSeats: [18, 19, 20, 21, 22, 23, 24],
  },
  {
    rowName: 'P',
    radius: 18.5,
    y: 2.6,
    tier: 'Premium',
    category: 'PREMIUM',
    price: 28.0,
    leftSeats: [1, 2],
    centerSeats: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
    rightSeats: [18, 19, 20, 21, 22, 23, 24],
  },
  {
    rowName: 'Q',
    radius: 17.0,
    y: 2.0,
    tier: 'Standard',
    category: 'STANDARD',
    price: 21.0,
    leftSeats: [1, 2, 3],
    centerSeats: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
    rightSeats: [18, 19, 20, 21, 22, 23],
  },
  {
    rowName: 'R',
    radius: 15.5,
    y: 1.4,
    tier: 'Standard',
    category: 'STANDARD',
    price: 21.0,
    leftSeats: [1, 2, 3],
    centerSeats: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
    rightSeats: [18, 19, 20, 21, 22],
  },
  {
    rowName: 'S',
    radius: 14.0,
    y: 0.9,
    tier: 'Standard',
    category: 'STANDARD',
    price: 21.0,
    leftSeats: [1, 2, 3],
    centerSeats: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    rightSeats: [17, 18, 19, 20],
    wheelchairSeats: [4, 5, 6, 7, 8],
  },
  {
    rowName: 'T',
    radius: 12.5,
    y: 0.5,
    tier: 'Standard',
    category: 'STANDARD',
    price: 21.0,
    leftSeats: [],
    centerSeats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    rightSeats: [],
  },
];

const Z_CENTER = -26.0;

// All seats start fully available for customer reservation
const DEFAULT_PRE_BOOKED = new Set<string>();

function generateFallbackSeats(): SeatNode[] {
  const generated: SeatNode[] = [];

  for (const cfg of FAN_ROW_CONFIGS) {
    const R = cfg.radius;
    const Y = cfg.y;

    interface SeatGenDef {
      seatNumber: number;
      theta: number;
      section: 'LEFT' | 'CENTER' | 'RIGHT';
    }
    const rowSeats: SeatGenDef[] = [];

    // Left Section
    const tEndL = (-15.5 * Math.PI) / 180;
    const stepAngle = (2.8 * Math.PI) / 180;
    const numL = cfg.leftSeats.length;
    for (let i = 0; i < numL; i++) {
      const theta = tEndL - (numL - 1 - i) * stepAngle;
      rowSeats.push({
        seatNumber: cfg.leftSeats[i],
        theta,
        section: 'LEFT',
      });
    }

    // Center Section
    const numC = cfg.centerSeats.length;
    const maxC = 12.0 * (Math.PI / 180);
    const spanC = numC >= 17 ? maxC : (numC / 17) * maxC;
    for (let i = 0; i < numC; i++) {
      const frac = numC > 1 ? i / (numC - 1) : 0.5;
      const theta = -spanC + frac * (2 * spanC);
      rowSeats.push({
        seatNumber: cfg.centerSeats[i],
        theta,
        section: 'CENTER',
      });
    }

    // Right Section
    const tStartR = (15.5 * Math.PI) / 180;
    const numR = cfg.rightSeats.length;
    for (let i = 0; i < numR; i++) {
      const theta = tStartR + i * stepAngle;
      rowSeats.push({
        seatNumber: cfg.rightSeats[i],
        theta,
        section: 'RIGHT',
      });
    }

    const wheelchairSet = new Set(cfg.wheelchairSeats || []);

    for (const item of rowSeats) {
      const { seatNumber, theta, section } = item;
      const seatCode = `${cfg.rowName}-${seatNumber}`;
      const posX = Number((R * Math.sin(theta)).toFixed(3));
      const posZ = Number((Z_CENTER + R * Math.cos(theta)).toFixed(3));
      const posY = Number(Y.toFixed(3));
      const angleY = Number((-theta).toFixed(4));

      const isVipCenter =
        cfg.rowName === 'E' &&
        section === 'CENTER' &&
        (seatNumber === 15 || seatNumber === 16);

      const isWheelchair = wheelchairSet.has(seatNumber);

      generated.push({
        seatCode,
        rowName: cfg.rowName,
        seatNumber,
        section,
        category: cfg.category as any,
        tier: cfg.tier,
        price: cfg.price,
        status: DEFAULT_PRE_BOOKED.has(seatCode) ? 'BOOKED' : 'AVAILABLE',
        isVipCenter,
        isWheelchair,
        x: posX,
        y: posY,
        z: posZ,
        angleY,
      });
    }
  }

  return generated;
}

/**
 * Creates custom 3D curved stepped tier platform buffer geometry
 */
function createCurvedTierGeometry(
  rInner: number,
  rOuter: number,
  yBottom: number,
  yTop: number,
  thetaStart: number,
  thetaEnd: number,
  segments: number = 36
): THREE.BufferGeometry {
  const geo = new THREE.BufferGeometry();
  const positions: number[] = [];
  const normals: number[] = [];

  const dTheta = (thetaEnd - thetaStart) / segments;

  for (let i = 0; i < segments; i++) {
    const t0 = thetaStart + i * dTheta;
    const t1 = t0 + dTheta;

    const sin0 = Math.sin(t0);
    const cos0 = Math.cos(t0);
    const sin1 = Math.sin(t1);
    const cos1 = Math.cos(t1);

    // 1. Top face (y = yTop)
    // Vertices: A(inner, t0), B(outer, t0), C(outer, t1), D(inner, t1)
    positions.push(
      rInner * sin0, yTop, rInner * cos0,
      rOuter * sin0, yTop, rOuter * cos0,
      rOuter * sin1, yTop, rOuter * cos1,

      rInner * sin0, yTop, rInner * cos0,
      rOuter * sin1, yTop, rOuter * cos1,
      rInner * sin1, yTop, rInner * cos1
    );
    for (let k = 0; k < 6; k++) normals.push(0, 1, 0);

    // 2. Front riser face (r = rInner, facing towards focal center)
    positions.push(
      rInner * sin0, yBottom, rInner * cos0,
      rInner * sin0, yTop,    rInner * cos0,
      rInner * sin1, yTop,    rInner * cos1,

      rInner * sin0, yBottom, rInner * cos0,
      rInner * sin1, yTop,    rInner * cos1,
      rInner * sin1, yBottom, rInner * cos1
    );
    const n0x = -sin0, n0z = -cos0;
    const n1x = -sin1, n1z = -cos1;
    normals.push(
      n0x, 0, n0z,
      n0x, 0, n0z,
      n1x, 0, n1z,

      n0x, 0, n0z,
      n1x, 0, n1z,
      n1x, 0, n1z
    );
  }

  // Left and Right End Caps
  // Left end cap at thetaStart
  const sL = Math.sin(thetaStart), cL = Math.cos(thetaStart);
  positions.push(
    rInner * sL, yBottom, rInner * cL,
    rInner * sL, yTop,    rInner * cL,
    rOuter * sL, yTop,    rOuter * cL,

    rInner * sL, yBottom, rInner * cL,
    rOuter * sL, yTop,    rOuter * cL,
    rOuter * sL, yBottom, rOuter * cL
  );
  // Normal pointing perpendicular along tangent (-cL, 0, sL)
  for (let k = 0; k < 6; k++) normals.push(-cL, 0, sL);

  // Right end cap at thetaEnd
  const sR = Math.sin(thetaEnd), cR = Math.cos(thetaEnd);
  positions.push(
    rInner * sR, yBottom, rInner * sR,
    rOuter * sR, yTop,    rOuter * cR,
    rInner * sR, yTop,    rInner * cR,

    rInner * sR, yBottom, rInner * cR,
    rOuter * sR, yBottom, rOuter * cR,
    rOuter * sR, yTop,    rOuter * cR
  );
  for (let k = 0; k < 6; k++) normals.push(cR, 0, -sR);

  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geo.computeVertexNormals();
  return geo;
}

export const Auditorium3D: React.FC<Auditorium3DProps> = ({
  seats = [],
  selectedSeatCodes,
  onToggleSeat,
  interactive = true,
  theme = 'dark',
  city,
}) => {
  const isLight = theme === 'light';
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredSeat, setHoveredSeat] = useState<{
    code: string;
    tier: string;
    price: number;
    status: string;
    section?: string;
    x: number;
    y: number;
  } | null>(null);

  const [activePreset, setActivePreset] = useState<string>('angle');
  const [sightlineSeat, setSightlineSeat] = useState<SeatNode | null>(null);

  const controlsRef = useRef<any>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '';

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 580;

    const activeSeats = seats && seats.length > 0 ? seats : generateFallbackSeats();

    // 1. SCENE
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isLight ? 0xf3f1ec : 0x090c14);
    scene.fog = new THREE.FogExp2(isLight ? 0xf3f1ec : 0x090c14, isLight ? 0.0052 : 0.009);

    // 2. CAMERA
    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 1000);

    // 3. RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isLight ? 1.08 : 1.40;
    container.appendChild(renderer.domElement);

    // 4. LIGHTING SETUP
    // Ambient light - crisp and architectural so auditorium depth is clear
    const ambientLight = new THREE.AmbientLight(isLight ? 0xfff8f0 : 0x7084a4, isLight ? 2.2 : 3.4);
    scene.add(ambientLight);

    // Key Light from front-right
    const keyLight = new THREE.DirectionalLight(0xfff7ee, isLight ? 2.7 : 3.2);
    keyLight.position.set(18, 26, -5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Fill Light from front-left
    const fillLight = new THREE.DirectionalLight(isLight ? 0xe5eef8 : 0xa5c4e8, isLight ? 1.8 : 2.2);
    fillLight.position.set(-22, 20, 5);
    scene.add(fillLight);

    // Ceiling Downlights
    const downLight = new THREE.DirectionalLight(isLight ? 0xffffff : 0xffeedd, isLight ? 1.4 : 1.8);
    downLight.position.set(0, 30, 4);
    scene.add(downLight);

    // Projector Spotlight from rear booth window, converging directly onto screen center
    const projectorSpot = new THREE.SpotLight(0xaad5ff, isLight ? 3.4 : 5.2, 90, Math.PI / 4, 0.45, 1.0);
    projectorSpot.position.set(0, 18.0, 18.8);
    projectorSpot.target.position.set(0, 9.5, -24.0);
    scene.add(projectorSpot);
    scene.add(projectorSpot.target);

    // Screen Center Bounce Light (reflects subtle premiere glow back onto audience)
    const screenBounce = new THREE.PointLight(isLight ? 0xb83b08 : 0x38bdf8, isLight ? 2.0 : 3.2, 42);
    screenBounce.position.set(0, 9.5, -20.0);
    scene.add(screenBounce);

    // Radial Aisles Floor Accent Lights (Warm Terracotta / Amber)
    const aisleLightL = new THREE.PointLight(isLight ? 0xb83b08 : 0xff5500, isLight ? 1.8 : 2.6, 32);
    aisleLightL.position.set(-6.5, 4.0, 2.0);
    scene.add(aisleLightL);

    const aisleLightR = new THREE.PointLight(isLight ? 0xb83b08 : 0xff5500, isLight ? 1.8 : 2.6, 32);
    aisleLightR.position.set(6.5, 4.0, 2.0);
    scene.add(aisleLightR);

    // 5. AUDITORIUM TIERS & FLOOR
    const floorGroup = new THREE.Group();
    floorGroup.position.set(0, 0, Z_CENTER);
    scene.add(floorGroup);

    const riserMat = new THREE.MeshStandardMaterial({
      color: isLight ? 0xd9d5cb : 0x161c28,
      roughness: 0.72,
      metalness: isLight ? 0.05 : 0.12,
    });
    const stepTopMat = new THREE.MeshStandardMaterial({
      color: isLight ? 0xe7e3da : 0x222a3a,
      roughness: 0.62,
      metalness: isLight ? 0.06 : 0.18,
    });
    const walkwayMat = new THREE.MeshStandardMaterial({
      color: isLight ? 0xcfcac0 : 0x1b2332,
      roughness: 0.68,
      metalness: isLight ? 0.06 : 0.15,
    });
    const ledMat = new THREE.MeshBasicMaterial({ color: isLight ? 0xb83b08 : 0xff6500 });
    const aisleDotMat = new THREE.MeshBasicMaterial({ color: isLight ? 0xd96126 : 0xff9933 });

    // Main base floor
    const baseFloorGeo = new THREE.BoxGeometry(68, 1.0, 75);
    const baseFloor = new THREE.Mesh(baseFloorGeo, riserMat);
    baseFloor.position.set(0, -0.5, 20.0);
    baseFloor.receiveShadow = true;
    floorGroup.add(baseFloor);

    const thetaStart = (-31.5 * Math.PI) / 180;
    const thetaEnd = (31.5 * Math.PI) / 180;

    // Curved front stage apron in front of Row T (rInner = 5.5, rOuter = 11.75)
    const stageGeo = createCurvedTierGeometry(5.5, 11.75, 0, 0.25, thetaStart, thetaEnd, 48);
    const stageMesh = new THREE.Mesh(stageGeo, stepTopMat);
    stageMesh.receiveShadow = true;
    floorGroup.add(stageMesh);

    // Sort configs by radius ascending: Row T (R = 12.5) up to Row A (R = 41.5)
    const sortedConfigs = [...FAN_ROW_CONFIGS].sort((a, b) => a.radius - b.radius);

    sortedConfigs.forEach((cfg, idx) => {
      // Build curved transverse walkway concourse break between Row L (R = 23.0) and Row K (R = 26.2)
      if (cfg.rowName === 'K') {
        const wRInner = 23.85;
        const wROuter = 25.40;
        const wYBottom = 4.8;
        const wYTop = 5.3;

        const walkwayGeo = createCurvedTierGeometry(wRInner, wROuter, wYBottom, wYTop, thetaStart, thetaEnd, 48);
        const walkwayMesh = new THREE.Mesh(walkwayGeo, walkwayMat);
        walkwayMesh.receiveShadow = true;
        floorGroup.add(walkwayMesh);

        // Walkway front and rear edge amber LED strips
        const wSegments = 48;
        const wPositions: number[] = [];
        const dWTheta = (thetaEnd - thetaStart) / wSegments;
        for (let s = 0; s < wSegments; s++) {
          const t0 = thetaStart + s * dWTheta;
          const t1 = t0 + dWTheta;
          const s0 = Math.sin(t0), c0 = Math.cos(t0);
          const s1 = Math.sin(t1), c1 = Math.cos(t1);

          wPositions.push(
            wRInner * s0, wYTop + 0.02, wRInner * c0,
            (wRInner + 0.06) * s0, wYTop + 0.02, (wRInner + 0.06) * c0,
            (wRInner + 0.06) * s1, wYTop + 0.02, (wRInner + 0.06) * c1,

            wRInner * s0, wYTop + 0.02, wRInner * c0,
            (wRInner + 0.06) * s1, wYTop + 0.02, (wRInner + 0.06) * c1,
            wRInner * s1, wYTop + 0.02, wRInner * c1
          );
        }
        const wStripGeo = new THREE.BufferGeometry();
        wStripGeo.setAttribute('position', new THREE.Float32BufferAttribute(wPositions, 3));
        const wStripMesh = new THREE.Mesh(wStripGeo, ledMat);
        floorGroup.add(wStripMesh);
      }

      // Tier dimensions
      let rInner = cfg.radius - 0.75;
      let rOuter = cfg.radius + 0.75;
      if (idx === 0) rInner = 11.75;
      if (idx === sortedConfigs.length - 1) rOuter = 42.6;

      const prevCfg = idx > 0 ? sortedConfigs[idx - 1] : null;
      let yBottom = 0.25;
      if (prevCfg) {
        yBottom = cfg.rowName === 'K' ? 5.3 : prevCfg.y;
      }
      const yTop = cfg.y;

      const tierGeo = createCurvedTierGeometry(rInner, rOuter, yBottom, yTop, thetaStart, thetaEnd, 48);
      const tierMesh = new THREE.Mesh(tierGeo, stepTopMat);
      tierMesh.receiveShadow = true;
      floorGroup.add(tierMesh);

      // Curved Amber LED Safety Strip along the front lip of each tier
      const stripSegments = 48;
      const stripPositions: number[] = [];
      const dTheta = (thetaEnd - thetaStart) / stripSegments;
      for (let s = 0; s < stripSegments; s++) {
        const t0 = thetaStart + s * dTheta;
        const t1 = t0 + dTheta;
        const s0 = Math.sin(t0), c0 = Math.cos(t0);
        const s1 = Math.sin(t1), c1 = Math.cos(t1);

        stripPositions.push(
          rInner * s0, yTop + 0.02, rInner * c0,
          (rInner + 0.06) * s0, yTop + 0.02, (rInner + 0.06) * c0,
          (rInner + 0.06) * s1, yTop + 0.02, (rInner + 0.06) * c1,

          rInner * s0, yTop + 0.02, rInner * c0,
          (rInner + 0.06) * s1, yTop + 0.02, (rInner + 0.06) * c1,
          rInner * s1, yTop + 0.02, rInner * c1
        );
      }
      const stripGeo = new THREE.BufferGeometry();
      stripGeo.setAttribute('position', new THREE.Float32BufferAttribute(stripPositions, 3));
      const stripMesh = new THREE.Mesh(stripGeo, ledMat);
      floorGroup.add(stripMesh);

      // Illuminated Step Markers along the two Radial Aisles (Left Aisle ~ -13.5 deg, Right Aisle ~ +13.5 deg)
      const dotGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.04, 12);

      const tAisleL = (-13.5 * Math.PI) / 180;
      const dotL = new THREE.Mesh(dotGeo, aisleDotMat);
      dotL.position.set(rInner * Math.sin(tAisleL), yTop + 0.03, rInner * Math.cos(tAisleL));
      floorGroup.add(dotL);

      const tAisleR = (13.5 * Math.PI) / 180;
      const dotR = new THREE.Mesh(dotGeo, aisleDotMat);
      dotR.position.set(rInner * Math.sin(tAisleR), yTop + 0.03, rInner * Math.cos(tAisleR));
      floorGroup.add(dotR);
    });

    // 6. GIANT CURVED IMAX SILVER SCREEN (Horizontally Centered on Front Wall)
    // Centered at X = 0, Z = -24.0, Y = 9.5
    const screenWidth = 42;
    const screenHeight = 17.5;
    const screenSegments = 48;
    const screenGeo = new THREE.PlaneGeometry(screenWidth, screenHeight, screenSegments, 1);
    const screenPos = screenGeo.attributes.position;
    const screenCurveDepth = 4.8;

    for (let i = 0; i < screenPos.count; i++) {
      const x = screenPos.getX(i);
      const normX = (2 * x) / screenWidth;
      // Parabolic concave curvature wrapping around audience
      const zOffset = normX * normX * screenCurveDepth;
      screenPos.setZ(i, zOffset);
    }
    screenGeo.computeVertexNormals();

    // High-fidelity premiere texture canvas
    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 2048;
    screenCanvas.height = 1024;
    const sctx = screenCanvas.getContext('2d');
    if (sctx) {
      // Cosmic deep space backdrop
      const sGrad = sctx.createRadialGradient(1024, 512, 50, 1024, 512, 1100);
      sGrad.addColorStop(0, '#102238');
      sGrad.addColorStop(0.3, '#0c182a');
      sGrad.addColorStop(0.65, '#070f1b');
      sGrad.addColorStop(1, '#020509');
      sctx.fillStyle = sGrad;
      sctx.fillRect(0, 0, 2048, 1024);

      // Starfield dots
      sctx.fillStyle = '#ffffff';
      for (let i = 0; i < 140; i++) {
        const sx = (Math.sin(i * 123.45) * 0.5 + 0.5) * 2048;
        const sy = (Math.cos(i * 678.9) * 0.5 + 0.5) * 1024;
        const sr = i % 3 === 0 ? 2.2 : 1.2;
        sctx.globalAlpha = 0.3 + (i % 5) * 0.14;
        sctx.beginPath();
        sctx.arc(sx, sy, sr, 0, Math.PI * 2);
        sctx.fill();
      }
      sctx.globalAlpha = 1.0;

      // Central anamorphic glow
      const glow = sctx.createRadialGradient(1024, 490, 0, 1024, 490, 480);
      glow.addColorStop(0, 'rgba(0, 210, 255, 0.25)');
      glow.addColorStop(0.3, 'rgba(255, 85, 0, 0.22)');
      glow.addColorStop(0.6, 'rgba(255, 85, 0, 0.06)');
      glow.addColorStop(1, 'transparent');
      sctx.fillStyle = glow;
      sctx.beginPath();
      sctx.arc(1024, 490, 480, 0, Math.PI * 2);
      sctx.fill();

      // Anamorphic laser streak
      const streak = sctx.createLinearGradient(0, 490, 2048, 490);
      streak.addColorStop(0, 'transparent');
      streak.addColorStop(0.3, 'rgba(0, 210, 255, 0.15)');
      streak.addColorStop(0.5, 'rgba(255, 255, 255, 0.7)');
      streak.addColorStop(0.7, 'rgba(0, 210, 255, 0.15)');
      streak.addColorStop(1, 'transparent');
      sctx.fillStyle = streak;
      sctx.fillRect(100, 488, 1848, 4);

      // Typography
      sctx.fillStyle = '#ff7a00';
      sctx.font = 'bold 34px sans-serif';
      sctx.textAlign = 'center';
      sctx.fillText('★ CINEVA 70MM MASTER RIG • DUAL LASER IMMERSION ★', 1024, 180);

      sctx.fillStyle = '#ffffff';
      sctx.font = 'bold 82px sans-serif';
      sctx.fillText('SOLARIS ODYSSEY', 1024, 470);

      sctx.fillStyle = '#00d2ff';
      sctx.font = 'bold 28px sans-serif';
      sctx.fillText('DIRECTED BY ANYA VANEEVA  •  ORIGINAL SCORE BY MAX RICHTER', 1024, 550);

      sctx.fillStyle = '#94a3b8';
      sctx.font = '26px sans-serif';
      sctx.fillText('PRESENTED IN DOLBY ATMOS 64CH  •  1.43:1 EXPANDED ASPECT RATIO', 1024, 630);

      // Border glow
      sctx.strokeStyle = 'rgba(255, 85, 0, 0.6)';
      sctx.lineWidth = 6;
      sctx.strokeRect(50, 50, 1948, 924);
    }

    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    const screenMat = new THREE.MeshStandardMaterial({
      map: screenTexture,
      roughness: 0.22,
      metalness: 0.05,
      emissive: 0x142233,
      emissiveIntensity: 0.72,
      side: THREE.DoubleSide,
    });

    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(0, 9.5, -24.0);
    scene.add(screenMesh);

    // Frame for screen matching the concave curvature
    const frameGeo = new THREE.PlaneGeometry(screenWidth + 0.8, screenHeight + 0.8, screenSegments, 1);
    const fPos = frameGeo.attributes.position;
    for (let i = 0; i < fPos.count; i++) {
      const x = fPos.getX(i);
      const normX = (2 * x) / (screenWidth + 0.8);
      const zOffset = normX * normX * screenCurveDepth - 0.08;
      fPos.setZ(i, zOffset);
    }
    frameGeo.computeVertexNormals();
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x050608, roughness: 0.92 });
    const screenFrame = new THREE.Mesh(frameGeo, frameMat);
    screenFrame.position.copy(screenMesh.position);
    scene.add(screenFrame);

    // 6b. SCREEN TOP ARCHITECTURAL HEADER BEAM & OVERHEAD GLOW (Visible in 3D & Top Plan View)
    const topBeamGeo = new THREE.BufferGeometry();
    const topBeamPositions: number[] = [];
    const bSegments = 48;
    const dX = screenWidth / bSegments;
    for (let i = 0; i < bSegments; i++) {
      const x0 = -screenWidth / 2 + i * dX;
      const x1 = x0 + dX;
      const norm0 = (2 * x0) / screenWidth;
      const norm1 = (2 * x1) / screenWidth;
      const z0 = -24.0 + norm0 * norm0 * screenCurveDepth;
      const z1 = -24.0 + norm1 * norm1 * screenCurveDepth;

      // Horizontal Top Cap Face at Y = 18.4, depth 1.4m behind screen towards -Z
      topBeamPositions.push(
        x0, 18.4, z0,
        x0, 18.4, z0 - 1.4,
        x1, 18.4, z1 - 1.4,

        x0, 18.4, z0,
        x1, 18.4, z1 - 1.4,
        x1, 18.4, z1
      );
      // Front valence face from Y = 18.0 to 18.4
      topBeamPositions.push(
        x0, 18.0, z0,
        x0, 18.4, z0,
        x1, 18.4, z1,

        x0, 18.0, z0,
        x1, 18.4, z1,
        x1, 18.0, z1
      );
    }
    topBeamGeo.setAttribute('position', new THREE.Float32BufferAttribute(topBeamPositions, 3));
    topBeamGeo.computeVertexNormals();
    const topBeamMat = new THREE.MeshStandardMaterial({
      color: isLight ? 0x2a2825 : 0x141820,
      roughness: 0.65,
    });
    const topBeamMesh = new THREE.Mesh(topBeamGeo, topBeamMat);
    scene.add(topBeamMesh);

    // Glowing Orange LED Lip along the Top Header of the Screen
    const topLipPositions: number[] = [];
    for (let i = 0; i < bSegments; i++) {
      const x0 = -screenWidth / 2 + i * dX;
      const x1 = x0 + dX;
      const norm0 = (2 * x0) / screenWidth;
      const norm1 = (2 * x1) / screenWidth;
      const z0 = -24.0 + norm0 * norm0 * screenCurveDepth;
      const z1 = -24.0 + norm1 * norm1 * screenCurveDepth;
      topLipPositions.push(
        x0, 18.42, z0,
        x0, 18.42, z0 + 0.12,
        x1, 18.42, z1 + 0.12,

        x0, 18.42, z0,
        x1, 18.42, z1 + 0.12,
        x1, 18.42, z1
      );
    }
    const topLipGeo = new THREE.BufferGeometry();
    topLipGeo.setAttribute('position', new THREE.Float32BufferAttribute(topLipPositions, 3));
    const topLipMesh = new THREE.Mesh(topLipGeo, ledMat);
    scene.add(topLipMesh);

    // Floor Optical Projection Sightlines & Focal Decal on the Stage Apron
    const stageLineGeo = new THREE.BufferGeometry();
    const stageLinePos: number[] = [];
    for (let i = 0; i < bSegments; i++) {
      const x0 = -screenWidth / 2 + i * dX;
      const x1 = x0 + dX;
      const norm0 = (2 * x0) / screenWidth;
      const norm1 = (2 * x1) / screenWidth;
      const z0 = -22.5 + norm0 * norm0 * (screenCurveDepth * 0.85);
      const z1 = -22.5 + norm1 * norm1 * (screenCurveDepth * 0.85);
      stageLinePos.push(
        x0, 0.28, z0,
        x0, 0.28, z0 + 0.18,
        x1, 0.28, z1 + 0.18,

        x0, 0.28, z0,
        x1, 0.28, z1 + 0.18,
        x1, 0.28, z1
      );
    }
    stageLineGeo.setAttribute('position', new THREE.Float32BufferAttribute(stageLinePos, 3));
    const stageLineMesh = new THREE.Mesh(stageLineGeo, ledMat);
    scene.add(stageLineMesh);

    // Center Optical Crosshair on Stage Floor
    const crossGeoH = new THREE.BoxGeometry(2.4, 0.04, 0.12);
    const crossMeshH = new THREE.Mesh(crossGeoH, ledMat);
    crossMeshH.position.set(0, 0.30, -20.5);
    scene.add(crossMeshH);

    const crossGeoV = new THREE.BoxGeometry(0.12, 0.04, 2.4);
    const crossMeshV = new THREE.Mesh(crossGeoV, ledMat);
    crossMeshV.position.set(0, 0.30, -20.5);
    scene.add(crossMeshV);

    // Overhead Screen Indicator Banner (Floating 3D Billboard facing up and forward)
    const bannerCanvas = document.createElement('canvas');
    bannerCanvas.width = 1024;
    bannerCanvas.height = 128;
    const bctx = bannerCanvas.getContext('2d');
    if (bctx) {
      bctx.fillStyle = isLight ? '#141414' : '#0b0e14';
      bctx.fillRect(0, 0, 1024, 128);
      bctx.strokeStyle = isLight ? '#b83b08' : '#ff6500';
      bctx.lineWidth = 6;
      bctx.strokeRect(6, 6, 1012, 116);

      bctx.fillStyle = isLight ? '#e86a38' : '#ff6500';
      bctx.font = 'bold 42px sans-serif';
      bctx.textAlign = 'center';
      bctx.fillText('▼ 70MM CURVED SILVER SCREEN (HORIZONTALLY CENTRED) ▼', 512, 60);

      bctx.fillStyle = '#e5e3dd';
      bctx.font = '26px sans-serif';
      bctx.fillText('ALL EYES THIS WAY • OPTIMUM PROJECTION AXIS', 512, 100);
    }
    const bannerTex = new THREE.CanvasTexture(bannerCanvas);
    const bannerMat = new THREE.MeshBasicMaterial({ map: bannerTex, side: THREE.DoubleSide });
    const bannerMesh = new THREE.Mesh(new THREE.PlaneGeometry(26, 3.2), bannerMat);
    bannerMesh.position.set(0, 19.5, -23.0);
    // Tilted slightly up towards the ceiling so both front angle and overhead plan cameras clearly read it
    bannerMesh.rotation.x = -Math.PI * 0.22;
    scene.add(bannerMesh);

    // 7. FAN-SHAPED SPLAYED ACOUSTIC WALLS (Widening from front to rear as per sketch)
    const wallMat = new THREE.MeshStandardMaterial({
      color: isLight ? 0xdbd6cc : 0x0f1116,
      roughness: isLight ? 0.82 : 0.85,
      metalness: isLight ? 0.04 : 0.15,
    });

    for (const side of [-1, 1]) {
      // 10 stepped acoustic baffles splaying outward along the fan angle
      for (let p = 0; p < 10; p++) {
        const frac = p / 9;
        const xPos = side * (19.5 + frac * 9.5);
        const zPos = -22.0 + frac * 41.5;
        const yPos = 8.5 + frac * 6.5;

        const pGeo = new THREE.BoxGeometry(0.8, 22, 4.6);
        const panel = new THREE.Mesh(pGeo, wallMat);
        panel.position.set(xPos, yPos, zPos);
        panel.rotation.y = side * 0.16;
        scene.add(panel);

        if (p % 2 === 1) {
          const sconceGeo = new THREE.BoxGeometry(0.06, 14, 0.12);
          const sconce = new THREE.Mesh(sconceGeo, ledMat);
          sconce.position.set(side * (19.0 + frac * 9.5), yPos, zPos);
          scene.add(sconce);
        }
      }
    }

    // Rear wall at Z = 19.5
    const rearWallGeo = new THREE.BoxGeometry(62, 26, 1.5);
    const rearWall = new THREE.Mesh(rearWallGeo, wallMat);
    rearWall.position.set(0, 13.0, 19.5);
    scene.add(rearWall);

    // Centered Projection Booth Window matching sketch
    const boothGeo = new THREE.BoxGeometry(5.0, 2.2, 0.6);
    const boothMat = new THREE.MeshBasicMaterial({ color: 0x05070a });
    const booth = new THREE.Mesh(boothGeo, boothMat);
    booth.position.set(0, 18.0, 18.8);
    scene.add(booth);

    // Architectural Stairs leading to booth as shown in the sketch
    for (let st = 0; st < 8; st++) {
      const stGeo = new THREE.BoxGeometry(3.2, 0.35, 0.8);
      const stMesh = new THREE.Mesh(stGeo, stepTopMat);
      stMesh.position.set(-8.0, 13.5 + st * 0.45, 16.0 + st * 0.35);
      scene.add(stMesh);
    }

    // Projector Lens Flare / Starburst Glow
    const flareCanvas = document.createElement('canvas');
    flareCanvas.width = 256;
    flareCanvas.height = 256;
    const fctx = flareCanvas.getContext('2d');
    if (fctx) {
      const grad = fctx.createRadialGradient(128, 128, 0, 128, 128, 120);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
      grad.addColorStop(0.15, 'rgba(200, 230, 255, 0.9)');
      grad.addColorStop(0.4, 'rgba(100, 180, 255, 0.4)');
      grad.addColorStop(0.8, 'rgba(40, 120, 255, 0.1)');
      grad.addColorStop(1, 'transparent');
      fctx.fillStyle = grad;
      fctx.fillRect(0, 0, 256, 256);

      fctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      fctx.lineWidth = 3;
      fctx.beginPath();
      fctx.moveTo(0, 128);
      fctx.lineTo(256, 128);
      fctx.moveTo(128, 0);
      fctx.lineTo(128, 256);
      fctx.stroke();
    }
    const flareTex = new THREE.CanvasTexture(flareCanvas);
    const flareMat = new THREE.SpriteMaterial({
      map: flareTex,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.95,
    });
    const flare = new THREE.Sprite(flareMat);
    flare.position.set(0, 18.0, 18.5);
    flare.scale.set(7.5, 7.5, 1);
    scene.add(flare);

    // 8. HIGH-FIDELITY CINEMA SEATS (CURVED ARCS, EACH FACING THE SCREEN CENTER)
    const seatGroup = new THREE.Group();
    scene.add(seatGroup);

    // Available Standard: Tailored obsidian charcoal (light) / midnight titanium (dark)
    const matAvailable = new THREE.MeshStandardMaterial({
      color: isLight ? 0x2a2927 : 0x242d3d,
      roughness: 0.44,
      metalness: isLight ? 0.08 : 0.16,
    });

    // Premium Available: Slate sapphire navy
    const matPremium = new THREE.MeshStandardMaterial({
      color: isLight ? 0x1e4068 : 0x1e3658,
      roughness: 0.36,
      metalness: 0.2,
    });

    // Selected: Luminous CINEVA terracotta (light) / vermilion blaze (dark)
    const matSelected = new THREE.MeshStandardMaterial({
      color: isLight ? 0xb83b08 : 0xff5500,
      emissive: isLight ? 0x9a3005 : 0xff3300,
      emissiveIntensity: isLight ? 0.45 : 0.65,
      roughness: 0.28,
      metalness: 0.2,
    });

    // Occupied: Muted stone grey (light) / matte graphite (dark)
    const matOccupied = new THREE.MeshStandardMaterial({
      color: isLight ? 0xc2beb4 : 0x131720,
      roughness: 0.88,
      metalness: 0.05,
    });

    // VIP Suite: Imperial cognac amber
    const matVip = new THREE.MeshStandardMaterial({
      color: isLight ? 0x85421b : 0x7a3a1e,
      roughness: 0.32,
      metalness: 0.22,
    });

    // Metal legs / floor mount
    const matMetal = new THREE.MeshStandardMaterial({
      color: isLight ? 0x3b3834 : 0x151922,
      roughness: 0.5,
      metalness: 0.75,
    });

    // Armrest top padding
    const matArmrest = new THREE.MeshStandardMaterial({
      color: isLight ? 0x23201d : 0x1c212c,
      roughness: 0.6,
      metalness: 0.2,
    });

    // Shared geometries
    const cushionGeo = new THREE.BoxGeometry(0.88, 0.22, 0.78);
    const ribGeo = new THREE.BoxGeometry(0.84, 0.19, 0.17);
    const headrestGeo = new THREE.BoxGeometry(0.74, 0.30, 0.20);
    const armTopGeo = new THREE.BoxGeometry(0.13, 0.08, 0.70);
    const armStemGeo = new THREE.BoxGeometry(0.07, 0.32, 0.11);
    const legGeo = new THREE.BoxGeometry(0.06, 0.40, 0.42);
    const haloGeo = new THREE.RingGeometry(0.42, 0.80, 24);

    activeSeats.forEach((seatData) => {
      const isSelected = selectedSeatCodes.includes(seatData.seatCode);
      const isBooked = seatData.status === 'BOOKED';

      let seatMat = matAvailable;
      if (isSelected) {
        seatMat = matSelected;
      } else if (isBooked) {
        seatMat = matOccupied;
      } else if (seatData.category === 'VIP_SUITE') {
        seatMat = matVip;
      } else if (seatData.category === 'PREMIUM') {
        seatMat = matPremium;
      }

      const seatPivot = new THREE.Group();
      seatPivot.name = seatData.seatCode;
      seatPivot.userData = {
        seatCode: seatData.seatCode,
        category: seatData.category,
        tier: seatData.tier,
        section: seatData.section,
        price: seatData.price,
        status: isSelected ? 'SELECTED' : seatData.status,
        x: seatData.x,
        y: seatData.y,
        z: seatData.z,
      };

      // 1. Base Cushion
      const cushion = new THREE.Mesh(cushionGeo, seatMat);
      cushion.position.set(0, 0.40, -0.05);
      cushion.castShadow = true;
      cushion.receiveShadow = true;
      seatPivot.add(cushion);

      // 2. Ribbed Ergonomic Backrest with 4 horizontal ribs
      const backrestPivot = new THREE.Group();
      backrestPivot.position.set(0, 0.44, 0.30);
      backrestPivot.rotation.x = 0.12;

      for (let r = 0; r < 4; r++) {
        const rib = new THREE.Mesh(ribGeo, seatMat);
        rib.position.set(0, 0.13 + r * 0.21, 0);
        rib.castShadow = true;
        backrestPivot.add(rib);
      }

      // 3. Headrest
      const headrest = new THREE.Mesh(headrestGeo, seatMat);
      headrest.position.set(0, 1.04, -0.02);
      headrest.castShadow = true;
      backrestPivot.add(headrest);
      seatPivot.add(backrestPivot);

      // 4. Armrests (Left & Right)
      for (const side of [-1, 1]) {
        const armGroup = new THREE.Group();
        armGroup.position.set(side * 0.49, 0.50, 0.0);

        const armTop = new THREE.Mesh(armTopGeo, matArmrest);
        armTop.position.set(0, 0.11, 0);
        armGroup.add(armTop);

        const armStemF = new THREE.Mesh(armStemGeo, matMetal);
        armStemF.position.set(0, -0.07, -0.20);
        armGroup.add(armStemF);

        const armStemB = new THREE.Mesh(armStemGeo, matMetal);
        armStemB.position.set(0, -0.07, 0.20);
        armGroup.add(armStemB);

        seatPivot.add(armGroup);
      }

      // 5. Metal Floor Legs
      for (const side of [-1, 1]) {
        const leg = new THREE.Mesh(legGeo, matMetal);
        leg.position.set(side * 0.34, 0.20, 0.02);
        seatPivot.add(leg);
      }

      // 6. Selected Luminous Floor Halo
      if (isSelected) {
        const haloMat = new THREE.MeshBasicMaterial({
          color: 0xff6e00,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.85,
        });
        const halo = new THREE.Mesh(haloGeo, haloMat);
        halo.rotation.x = Math.PI / 2;
        halo.position.set(0, 0.03, -0.02);
        seatPivot.add(halo);
      }

      // Position seat in 3D world
      seatPivot.position.set(seatData.x, seatData.y, seatData.z);

      // Radial alignment: each seat rotates to face directly at the center of the screen (0, 8.8, -22.0)
      if (typeof seatData.angleY === 'number') {
        seatPivot.rotation.y = seatData.angleY;
      } else {
        const angleToScreen = Math.atan2(-seatData.x, seatData.z - Z_CENTER);
        seatPivot.rotation.y = -angleToScreen;
      }

      seatGroup.add(seatPivot);
    });

    // 9. DUST PARTICLES IN PROJECTOR BEAM
    const dustCount = 180;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      const t = Math.random();
      dustPos[i] = 0 * (1 - t) + (Math.random() - 0.5) * (t * 28);
      dustPos[i + 1] = 18.0 * (1 - t) + 9.5 * t + (Math.random() - 0.5) * 4;
      dustPos[i + 2] = 18.5 * (1 - t) - 24.0 * t;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xffd5a0,
      size: 0.16,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    // 10. CAMERA PRESETS & CONTROLS
    const presets: Record<string, { pos: [number, number, number]; lookAt: [number, number, number] }> = {
      // 3/4 Elevated Auditorium Angle View (positioned cleanly inside the acoustic walls so all rows & curved screen are framed without wall occlusion)
      angle: { pos: [-16.5, 22.5, 11.5], lookAt: [0, 7.5, -8.5] },
      // View from Screen looking back at audience
      screen: { pos: [0, 9.5, -20.5], lookAt: [0, 9.0, 10.0] },
      // Center VIP Seat Sightline (Row E, Seat 15 - optimum center)
      pov: { pos: [0, 11.5, 7.5], lookAt: [0, 9.5, -24.0] },
      // Top-Down 2D Architectural Plan Overview (captures whole curved screen + fan seating bowl)
      plan: { pos: [0, 68.0, -4.0], lookAt: [0, 0, -6.0] },
    };

    let targetCamPos = new THREE.Vector3(...presets.angle.pos);
    let targetLookAt = new THREE.Vector3(...presets.angle.lookAt);
    let currentLookAt = new THREE.Vector3(...presets.angle.lookAt);

    camera.position.set(...presets.angle.pos);
    camera.lookAt(...presets.angle.lookAt);

    // Function to smoothly transition camera to the eye level of a selected seat
    const jumpToSeatSightline = (seat: SeatNode) => {
      // Position camera naturally just behind headrest looking at the curved screen
      targetCamPos.set(seat.x * 0.94, seat.y + 1.45, seat.z + 0.95);
      targetLookAt.set(0, 9.5, -24.0);
      setActivePreset(`seat-${seat.seatCode}`);
      setSightlineSeat(seat);
    };

    controlsRef.current = {
      setPreset: (name: string) => {
        if (presets[name]) {
          targetCamPos.set(...presets[name].pos);
          targetLookAt.set(...presets[name].lookAt);
          setActivePreset(name);
          setSightlineSeat(null);
        }
      },
      jumpToSeat: jumpToSeatSightline,
      reset: () => {
        targetCamPos.set(...presets.angle.pos);
        targetLookAt.set(...presets.angle.lookAt);
        setActivePreset('angle');
        setSightlineSeat(null);
      },
      zoomIn: () => {
        const dir = new THREE.Vector3().subVectors(targetLookAt, camera.position).normalize();
        targetCamPos.addScaledVector(dir, 4.0);
      },
      zoomOut: () => {
        const dir = new THREE.Vector3().subVectors(targetLookAt, camera.position).normalize();
        targetCamPos.addScaledVector(dir, -4.0);
      },
      rotateLeft: () => {
        const offset = new THREE.Vector3().subVectors(targetCamPos, targetLookAt);
        const radius = Math.sqrt(offset.x * offset.x + offset.z * offset.z);
        const theta = Math.atan2(offset.z, offset.x) + 0.35;
        targetCamPos.x = targetLookAt.x + radius * Math.cos(theta);
        targetCamPos.z = targetLookAt.z + radius * Math.sin(theta);
      },
      rotateRight: () => {
        const offset = new THREE.Vector3().subVectors(targetCamPos, targetLookAt);
        const radius = Math.sqrt(offset.x * offset.x + offset.z * offset.z);
        const theta = Math.atan2(offset.z, offset.x) - 0.35;
        targetCamPos.x = targetLookAt.x + radius * Math.cos(theta);
        targetCamPos.z = targetLookAt.z + radius * Math.sin(theta);
      },
    };

    // MOUSE DRAG / TOUCH INTERACTION
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) {
        if (interactive) {
          const rect = container.getBoundingClientRect();
          const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

          const raycaster = new THREE.Raycaster();
          raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);
          const intersects = raycaster.intersectObjects(seatGroup.children, true);

          if (intersects.length > 0) {
            let obj: any = intersects[0].object;
            while (obj && !obj.userData?.seatCode && obj.parent) {
              obj = obj.parent;
            }
            if (obj && obj.userData?.seatCode) {
              setHoveredSeat({
                code: obj.userData.seatCode,
                tier: obj.userData.tier || 'Standard',
                section: obj.userData.section,
                price: obj.userData.price || 18.5,
                status: obj.userData.status || 'AVAILABLE',
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
              });
              container.style.cursor = obj.userData.status === 'BOOKED' ? 'not-allowed' : 'pointer';
              return;
            }
          }
          setHoveredSeat(null);
          container.style.cursor = 'default';
        }
        return;
      }

      // Orbit dragging
      const deltaX = e.clientX - prevMouse.x;
      const deltaY = e.clientY - prevMouse.y;
      prevMouse = { x: e.clientX, y: e.clientY };

      const offset = new THREE.Vector3().subVectors(targetCamPos, targetLookAt);
      const radius = offset.length();
      let theta = Math.atan2(offset.z, offset.x);
      let phi = Math.acos(Math.max(-1, Math.min(1, offset.y / radius)));

      theta -= deltaX * 0.007;
      phi = Math.max(0.15, Math.min(Math.PI / 2 - 0.05, phi - deltaY * 0.005));

      targetCamPos.x = targetLookAt.x + radius * Math.sin(phi) * Math.cos(theta);
      targetCamPos.y = targetLookAt.y + radius * Math.cos(phi);
      targetCamPos.z = targetLookAt.z + radius * Math.sin(phi) * Math.sin(theta);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const dir = new THREE.Vector3().subVectors(targetLookAt, targetCamPos).normalize();
      const zoomDelta = e.deltaY * 0.02;
      const dist = targetCamPos.distanceTo(targetLookAt);

      if ((dist > 4 && zoomDelta > 0) || (dist < 55 && zoomDelta < 0)) {
        targetCamPos.addScaledVector(dir, zoomDelta);
      }
    };

    // ON CLICK: Toggle Seat & Fly Camera into Selected Seat POV (Sightline Preview)
    const onClick = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);
      const intersects = raycaster.intersectObjects(seatGroup.children, true);

      if (intersects.length > 0) {
        let obj: any = intersects[0].object;
        while (obj && !obj.userData?.seatCode && obj.parent) {
          obj = obj.parent;
        }
        if (obj && obj.userData?.seatCode) {
          const seatCode = obj.userData.seatCode;
          const seatData = activeSeats.find((s) => s.seatCode === seatCode);
          if (seatData && seatData.status !== 'BOOKED') {
            onToggleSeat(seatCode);
            setSightlineSeat(seatData);
            if (activePreset === 'pov' || activePreset.startsWith('seat-')) {
              jumpToSeatSightline(seatData);
            }
          }
        }
      }
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('wheel', onWheel, { passive: false });
    container.addEventListener('click', onClick);

    // 11. ANIMATION LOOP
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Smooth camera interpolation
      camera.position.lerp(targetCamPos, 0.08);
      currentLookAt.lerp(targetLookAt, 0.08);
      camera.lookAt(currentLookAt);

      const flicker = Math.sin(time * 3.5) * 0.15 + Math.cos(time * 7.1) * 0.08;
      projectorSpot.intensity = 5.0 + flicker;
      flare.scale.set(7.0 + flicker * 0.8, 7.0 + flicker * 0.8, 1);

      dust.rotation.y = time * 0.02;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 580;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('click', onClick);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [seats, selectedSeatCodes, interactive, theme]);

  return (
    <div className="relative w-full h-full select-none overflow-hidden">
      <div ref={containerRef} className="w-full h-full" />

      {/* Dynamic Sightline HUD Notification (When a seat is selected and viewing from that seat) */}
      {sightlineSeat && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
          <div className="flex items-center gap-3 px-4 py-2 rounded-full backdrop-blur-xl border border-cv-accent/40 shadow-elevated-xl animate-fade-in text-xs bg-cv-surface/95 text-cv-primary">
            <span className="flex items-center gap-1.5 text-cv-accent font-semibold">
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              <span>Seat {sightlineSeat.seatCode} ({sightlineSeat.section || 'Auditorium'}) Sightline</span>
            </span>
            <span className="w-px h-4 bg-cv-border" />
            <span className="text-cv-secondary font-medium">
              {sightlineSeat.tier} • {formatCurrency(sightlineSeat.price, city)}
            </span>
            <span className="w-px h-4 bg-cv-border" />
            <button
              onClick={() => controlsRef.current?.reset()}
              className="flex items-center gap-1 transition-colors hover:text-cv-accent ml-1 font-semibold text-cv-primary cursor-pointer"
            >
              <span>Reset</span>
              <span className="material-symbols-outlined text-[14px]">undo</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Seat Tooltip on Hover */}
      {hoveredSeat && !sightlineSeat && (
        <div
          className="absolute pointer-events-none z-30 px-3.5 py-2 rounded-xl backdrop-blur-md border border-cv-border shadow-elevated-xl text-xs flex flex-col gap-1 bg-cv-surface/95 text-cv-primary"
          style={{
            left: `${Math.min(window.innerWidth - 180, hoveredSeat.x + 15)}px`,
            top: `${Math.max(10, hoveredSeat.y - 65)}px`,
          }}
        >
          <div className="flex items-center gap-1.5 font-bold">
            <span className="text-cv-accent text-sm">{hoveredSeat.code}</span>
            <span className="text-cv-muted">&bull;</span>
            <span className="text-cv-primary">
              {hoveredSeat.section ? `${hoveredSeat.section} Section` : hoveredSeat.tier}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 text-[11px] text-cv-secondary">
            <span>Price: {formatCurrency(hoveredSeat.price, city)}</span>
            <span
              className={
                hoveredSeat.status === 'SELECTED'
                  ? 'text-cv-accent font-semibold'
                  : hoveredSeat.status === 'BOOKED'
                  ? 'text-red-600 dark:text-red-400 font-medium'
                  : 'text-emerald-700 dark:text-emerald-400 font-medium'
              }
            >
              {hoveredSeat.status}
            </span>
          </div>
        </div>
      )}

      {/* Camera Controls Toolbar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
        <div className="flex items-center gap-1.5 p-1.5 backdrop-blur-xl rounded-full border border-cv-border dark:border-[#222222] shadow-elevated-xl bg-cv-surface/95 dark:bg-[#111111]/95 text-cv-primary">
          <button
            onClick={() => controlsRef.current?.setPreset('angle')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activePreset === 'angle'
                ? 'bg-cv-ink text-white border border-cv-ink dark:bg-[#181818] dark:border-[#FF6500]/50 shadow-sm font-semibold'
                : 'text-cv-secondary hover:text-cv-primary hover:bg-cv-elevated dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/10'
            }`}
            title="3/4 Fan-Shaped Auditorium Angle View"
          >
            <span className="material-symbols-outlined text-[16px]">view_in_ar</span>
            <span className="hidden sm:inline">Auditorium Angle</span>
          </button>

          <button
            onClick={() => controlsRef.current?.setPreset('screen')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activePreset === 'screen'
                ? 'bg-cv-ink text-white border border-cv-ink dark:bg-[#181818] dark:border-[#FF6500]/50 shadow-sm font-semibold'
                : 'text-cv-secondary hover:text-cv-primary hover:bg-cv-elevated dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/10'
            }`}
            title="View from Centered Screen facing the Fan Seating Bowl"
          >
            <span className="material-symbols-outlined text-[16px]">theaters</span>
            <span className="hidden sm:inline">Front Screen</span>
          </button>

          <button
            onClick={() => {
              if (selectedSeatCodes.length > 0) {
                const targetCode = selectedSeatCodes[selectedSeatCodes.length - 1];
                const activeSeats = seats && seats.length > 0 ? seats : generateFallbackSeats();
                const seatData = activeSeats.find((s) => s.seatCode === targetCode);
                if (seatData) {
                  controlsRef.current?.jumpToSeat(seatData);
                  return;
                }
              }
              controlsRef.current?.setPreset('pov');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activePreset === 'pov' || activePreset.startsWith('seat-')
                ? 'bg-cv-ink text-white border border-cv-ink dark:bg-[#181818] dark:border-[#FF6500]/50 shadow-sm font-semibold'
                : 'text-cv-secondary hover:text-cv-primary hover:bg-cv-elevated dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/10'
            }`}
            title="Sightline View from Selected Seat facing Horizontally Centred Screen"
          >
            <span className="material-symbols-outlined text-[16px]">airline_seat_recline_extra</span>
            <span className="hidden sm:inline">Seat Sightline</span>
          </button>

          <button
            onClick={() => controlsRef.current?.setPreset('plan')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activePreset === 'plan'
                ? 'bg-cv-accent dark:bg-gradient-to-r dark:from-[#ff5500] dark:to-[#ff7a00] text-white shadow-glow-orange-sm dark:shadow-[0_0_15px_rgba(255,85,0,0.5)] font-semibold'
                : 'text-cv-secondary hover:text-cv-primary hover:bg-cv-elevated dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/10'
            }`}
            title="Top-Down Fan Seating Plan (Architectural Reference View)"
          >
            <span className="material-symbols-outlined text-[16px]">grid_view</span>
            <span className="hidden sm:inline">Top Plan</span>
          </button>

          <span className="w-px h-5 mx-1 bg-cv-border dark:bg-[#222222]" />

          <button
            onClick={() => controlsRef.current?.rotateLeft()}
            className="w-8 h-8 rounded-full flex items-center justify-center text-cv-secondary hover:text-cv-primary hover:bg-cv-elevated dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/10 transition-all"
            title="Rotate Left"
          >
            <span className="material-symbols-outlined text-[18px]">rotate_left</span>
          </button>
          <button
            onClick={() => controlsRef.current?.rotateRight()}
            className="w-8 h-8 rounded-full flex items-center justify-center text-cv-secondary hover:text-cv-primary hover:bg-cv-elevated dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/10 transition-all"
            title="Rotate Right"
          >
            <span className="material-symbols-outlined text-[18px]">rotate_right</span>
          </button>

          <button
            onClick={() => controlsRef.current?.zoomIn()}
            className="w-8 h-8 rounded-full flex items-center justify-center text-cv-secondary hover:text-cv-primary hover:bg-cv-elevated dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/10 transition-all"
            title="Zoom In"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
          </button>
          <button
            onClick={() => controlsRef.current?.zoomOut()}
            className="w-8 h-8 rounded-full flex items-center justify-center text-cv-secondary hover:text-cv-primary hover:bg-cv-elevated dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/10 transition-all"
            title="Zoom Out"
          >
            <span className="material-symbols-outlined text-[18px]">remove</span>
          </button>

          <button
            onClick={() => controlsRef.current?.reset()}
            className="w-8 h-8 rounded-full flex items-center justify-center text-cv-secondary hover:text-cv-primary hover:bg-cv-elevated dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/10 transition-all"
            title="Reset Camera"
          >
            <span className="material-symbols-outlined text-[18px]">restart_alt</span>
          </button>
        </div>
      </div>
    </div>
  );
};
