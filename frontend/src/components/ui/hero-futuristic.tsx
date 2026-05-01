'use client';

import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { useAspect, useTexture } from '@react-three/drei';
import { useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three/webgpu';
import { bloom } from 'three/examples/jsm/tsl/display/BloomNode.js';
import { Mesh } from 'three';

import {
  abs,
  blendScreen,
  float,
  mod,
  mx_cell_noise_float,
  oneMinus,
  smoothstep,
  texture,
  uniform,
  uv,
  vec2,
  vec3,
  pass,
  mix,
  add
} from 'three/tsl';

const TEXTUREMAP = { src: 'https://i.postimg.cc/XYwvXN8D/img-4.png' };
const DEPTHMAP = { src: 'https://i.postimg.cc/2SHKQh2q/raw-4.webp' };

extend(THREE as any);

// Post Processing component
const PostProcessing = ({
  strength = 1,
  threshold = 1,
  fullScreenEffect = true,
}: {
  strength?: number;
  threshold?: number;
  fullScreenEffect?: boolean;
}) => {
  const { gl, scene, camera } = useThree();
  const progressRef = useRef({ value: 0 });

  const render = useMemo(() => {
    // @ts-ignore
    const postProcessing = new THREE.PostProcessing(gl as any);
    const scenePass = pass(scene, camera);
    const scenePassColor = scenePass.getTextureNode('output');
    const bloomPass = bloom(scenePassColor, strength, 0.5, threshold);

    // Create the scanning effect uniform
    const uScanProgress = uniform(0);
    progressRef.current = uScanProgress;

    // Create a red overlay that follows the scan line
    const scanPos = float(uScanProgress.value);
    const uvY = uv().y;
    const scanWidth = float(0.02);
    
    // Add edge fade to prevent the "red line" at top/bottom
    const edgeFade = smoothstep(0, 0.05, uvY).mul(smoothstep(1.0, 0.95, uvY));
    
    const scanLine = smoothstep(0, scanWidth, abs(uvY.sub(scanPos)));
    const redOverlay = vec3(1, 0, 0).mul(oneMinus(scanLine)).mul(0.3).mul(edgeFade);

    // Mix the original scene with the red overlay
    const withScanEffect = mix(
      scenePassColor,
      add(scenePassColor, redOverlay),
      fullScreenEffect ? smoothstep(0.9, 1.0, oneMinus(scanLine)) : 0.8
    );

    // Add bloom effect after scan effect
    const final = withScanEffect.add(bloomPass);

    postProcessing.outputNode = final;

    return postProcessing;
  }, [camera, gl, scene, strength, threshold, fullScreenEffect]);

  useFrame(({ clock }) => {
    // Animate the scan line from top to bottom
    progressRef.current.value = (Math.sin(clock.getElapsedTime() * 0.5) * 0.5 + 0.5);
    render.renderAsync();
  }, 1);

  return null;
};

const WIDTH = 300;
const HEIGHT = 300;

const Scene = () => {
  const [rawMap, depthMap] = useTexture([TEXTUREMAP.src, DEPTHMAP.src]);

  const meshRef = useRef<Mesh>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show image after texture loading
    if (rawMap && depthMap) {
      setVisible(true);
    }
  }, [rawMap, depthMap]);

  const { material, uniforms } = useMemo(() => {
    const uPointer = uniform(new THREE.Vector2(0));
    const uProgress = uniform(0);

    const strength = 0.01;

    const tDepthMap = texture(depthMap);

    const tMap = texture(
      rawMap,
      uv().add(tDepthMap.r.mul(uPointer).mul(strength))
    );

    const aspect = float(WIDTH).div(HEIGHT);
    const tUv = vec2(uv().x.mul(aspect), uv().y);

    const tiling = vec2(120.0);
    const tiledUv = mod(tUv.mul(tiling), 2.0).sub(1.0);

    const brightness = mx_cell_noise_float(tUv.mul(tiling).div(2));

    const dist = float(tiledUv.length());
    const dot = float(smoothstep(0.5, 0.49, dist)).mul(brightness);

    const depth = tDepthMap;

    const flow = oneMinus(smoothstep(0, 0.02, abs(depth.r.sub(uProgress))));

    const mask = dot.mul(flow).mul(vec3(10, 0, 0));

    // @ts-ignore
    const final = blendScreen(tMap, mask);

    // @ts-ignore
    const material = new THREE.MeshBasicNodeMaterial({
      colorNode: final,
      transparent: true,
      opacity: 0,
    });

    return {
      material,
      uniforms: {
        uPointer,
        uProgress,
      },
    };
  }, [rawMap, depthMap]);

  const [w, h] = useAspect(WIDTH, HEIGHT);

  useFrame(({ clock }) => {
    uniforms.uProgress.value = (Math.sin(clock.getElapsedTime() * 0.5) * 0.5 + 0.5);
    // Smooth appearance
    if (meshRef.current && 'material' in meshRef.current && meshRef.current.material) {
      const mat = meshRef.current.material as any;
      if ('opacity' in mat) {
        mat.opacity = THREE.MathUtils.lerp(
          mat.opacity,
          visible ? 1 : 0,
          0.07
        );
      }
    }
  });

  useFrame(({ pointer }) => {
    uniforms.uPointer.value = pointer;
  });

  const scaleFactor = 0.40;
  return (
    <mesh ref={meshRef} scale={[w * scaleFactor, h * scaleFactor, 1]} material={material}>
      <planeGeometry />
    </mesh>
  );
};

export const HeroFuturistic = ({ 
  title = 'Build Your Dreams', 
  subtitle = 'AI-powered creativity for the next generation.' 
}: { 
  title?: string; 
  subtitle?: string; 
}) => {
  const titleWords = title.split(' ');
  const [visibleWords, setVisibleWords] = useState(0);
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [delays, setDelays] = useState<number[]>([]);
  const [subtitleDelay, setSubtitleDelay] = useState(0);

  useEffect(() => {
    // Client only: generate random delays
    setDelays(titleWords.map(() => Math.random() * 0.07));
    setSubtitleDelay(Math.random() * 0.1);
  }, [titleWords.length]);

  useEffect(() => {
    if (visibleWords < titleWords.length) {
      const timeout = setTimeout(() => setVisibleWords(visibleWords + 1), 600);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => setSubtitleVisible(true), 800);
      return () => clearTimeout(timeout);
    }
  }, [visibleWords, titleWords.length]);

  return (
    <div className="min-h-screen lg:h-screen w-full relative overflow-hidden bg-black py-20 lg:py-0">
      {/* Content Layer */}
      <div className="max-w-7xl mx-auto h-full px-6 md:px-10 grid grid-cols-1 lg:grid-cols-2 items-center pt-24 md:pt-32 relative z-10 pointer-events-none">
        <div className="flex flex-col items-start text-left uppercase">
          <div className="text-[2.5rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold max-w-4xl leading-[0.95] tracking-tighter">
            <div className="flex flex-col items-start gap-y-1 overflow-hidden text-white w-full">
              {title.split(' ').reduce((acc: string[][], word, i) => {
                // Optimal structure for BioVita headline
                // Line 1: ACCESS YOUR
                // Line 2: COMPLETE
                // Line 3: MEDICAL HISTORY
                if (i < 2) {
                  if (!acc[0]) acc[0] = [];
                  acc[0].push(word);
                } else if (i === 2) {
                  acc[1] = [word];
                } else {
                  if (!acc[2]) acc[2] = [];
                  acc[2].push(word);
                }
                return acc;
              }, []).map((line, lineIndex) => (
                <div key={lineIndex} className="flex flex-wrap gap-x-2 md:gap-x-4">
                  {line.map((word, wordIndex) => {
                    // Approximate global index for delay
                    const globalIndex = title.split(' ').indexOf(word);
                    return (
                      <div
                        key={wordIndex}
                        className={globalIndex < visibleWords ? 'animate-fade-in' : ''}
                        style={{ 
                          animationDelay: `${globalIndex * 0.13 + (delays[globalIndex] || 0)}s`, 
                          opacity: globalIndex < visibleWords ? 1 : 0,
                          transition: 'opacity 0.5s ease-in-out'
                        }}
                      >
                        {word.toUpperCase() === 'MEDICAL' ? (
                          <span className="text-red-500 inline-block bg-clip-text">
                            {word}
                          </span>
                        ) : (
                          word
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          <div className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl mt-4 md:mt-8 overflow-hidden text-white/60 font-bold max-w-xl normal-case tracking-normal">
            <div
              className={subtitleVisible ? 'animate-fade-in-subtitle' : ''}
              style={{ 
                animationDelay: `${titleWords.length * 0.13 + 0.2 + subtitleDelay}s`, 
                opacity: subtitleVisible ? 1 : 0,
                transition: 'opacity 0.5s ease-in-out'
              }}
            >
              {subtitle}
            </div>

            <div 
              className={`flex flex-wrap gap-4 mt-6 md:mt-12 pointer-events-auto transition-all duration-1000 ${subtitleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: `${titleWords.length * 0.13 + 0.5 + subtitleDelay}s` }}
            >
              <button
                 onClick={() => window.location.href = '/emergency'}
                 className="px-8 py-4 rounded-3xl bg-gradient-to-r from-red-600 to-red-500 text-white font-bold text-[11px] tracking-[0.1em] shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:scale-105 active:scale-95 transition-all"
              >
                EMERGENCY ACCESS
              </button>
              <button
                 onClick={() => window.location.href = '/portal'}
                 className="px-8 py-4 rounded-3xl glass border border-white/10 text-white font-bold text-[11px] tracking-[0.1em] hover:bg-white/10 hover:border-white/20 active:scale-95 transition-all"
              >
                JOIN BIOVITA
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Background Layer - Right Side */}
      <div className="absolute top-0 right-0 w-full lg:w-3/5 h-full z-0 opacity-80">
        <Canvas
          className="w-full h-full"
          flat
          gl={async (props) => {
            // @ts-ignore
            const renderer = new THREE.WebGPURenderer(props as any);
            await renderer.init();
            return renderer;
          }}
        >
          <PostProcessing fullScreenEffect={true} />
          <Scene />
        </Canvas>
      </div>
    </div>
  );
};

export default HeroFuturistic;
