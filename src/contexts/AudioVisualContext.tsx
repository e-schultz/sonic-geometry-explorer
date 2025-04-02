
import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import * as Tone from 'tone';

type VisualizerType = 'diamond' | 'circles' | 'lines' | 'maze' | 'bars' | 'spiral';

interface AudioVisualContextType {
  isPlaying: boolean;
  togglePlay: () => void;
  volume: number;
  setVolume: (volume: number) => void;
  bpm: number;
  setBpm: (bpm: number) => void;
  activeVisualizers: VisualizerType[];
  toggleVisualizer: (type: VisualizerType) => void;
  bassIntensity: number;
  setBassIntensity: (intensity: number) => void;
  melodyIntensity: number;
  setMelodyIntensity: (intensity: number) => void;
  audioAnalyser: Tone.Analyser | null;
  audioData: Float32Array;
}

const AudioVisualContext = createContext<AudioVisualContextType | undefined>(undefined);

export const useAudioVisual = () => {
  const context = useContext(AudioVisualContext);
  if (!context) {
    throw new Error('useAudioVisual must be used within an AudioVisualProvider');
  }
  return context;
};

export const AudioVisualProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.5);
  const [bpm, setBpmState] = useState(110);
  const [activeVisualizers, setActiveVisualizers] = useState<VisualizerType[]>([
    'diamond', 'circles', 'lines'
  ]);
  const [bassIntensity, setBassIntensity] = useState(0.7);
  const [melodyIntensity, setMelodyIntensity] = useState(0.6);
  const [audioData, setAudioData] = useState<Float32Array>(new Float32Array(0));
  
  // Audio references
  const toneSynthRef = useRef<any>(null);
  const bassSynthRef = useRef<any>(null);
  const hiHatRef = useRef<any>(null);
  const ambienceRef = useRef<any>(null);
  const masterVolumeRef = useRef<any>(null);
  const analyserRef = useRef<Tone.Analyser | null>(null);
  
  // Initialize audio components
  useEffect(() => {
    // Main volume control
    masterVolumeRef.current = new Tone.Volume(Tone.gainToDb(volume)).toDestination();
    
    // Analyzer for visualizations
    analyserRef.current = new Tone.Analyser('fft', 64);
    masterVolumeRef.current.connect(analyserRef.current);
    
    // Bass synth
    bassSynthRef.current = new Tone.MonoSynth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.05, decay: 0.2, sustain: 0.4, release: 1.4 },
      filterEnvelope: { attack: 0.001, decay: 0.7, sustain: 0.1, release: 0.8, baseFrequency: 300, octaves: 2.5 }
    }).connect(masterVolumeRef.current);
    
    // Melody synth
    toneSynthRef.current = new Tone.PolySynth(Tone.FMSynth, {
      harmonicity: 1.5,
      modulationIndex: 10,
      oscillator: { type: 'sine' },
      envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.5 },
      modulation: { type: 'square' },
      modulationEnvelope: { attack: 0.5, decay: 0.01, sustain: 0.2, release: 0.1 }
    }).connect(masterVolumeRef.current);
    
    // Hi-hat sound
    hiHatRef.current = new Tone.NoiseSynth({
      noise: { type: 'white' },
      envelope: { attack: 0.001, decay: 0.1, sustain: 0.01, release: 0.07 }
    }).connect(masterVolumeRef.current);
    
    // Ambient pad
    ambienceRef.current = new Tone.PolySynth(Tone.AMSynth, {
      harmonicity: 2.5,
      oscillator: { type: 'triangle' },
      envelope: { attack: 2, decay: 1, sustain: 0.8, release: 4 },
      modulation: { type: 'sine' }
    }).connect(new Tone.Reverb(5).connect(masterVolumeRef.current));
    
    // Setup transport
    Tone.Transport.bpm.value = bpm;
    
    // Animation frame for analyzer data
    let animationFrameId: number;
    
    const updateAnalyserData = () => {
      if (analyserRef.current) {
        setAudioData(analyserRef.current.getValue() as Float32Array);
      }
      animationFrameId = requestAnimationFrame(updateAnalyserData);
    };
    
    updateAnalyserData();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      Tone.Transport.stop();
      Tone.Transport.cancel();
      
      // Clean up audio nodes
      if (toneSynthRef.current) toneSynthRef.current.dispose();
      if (bassSynthRef.current) bassSynthRef.current.dispose();
      if (hiHatRef.current) hiHatRef.current.dispose();
      if (ambienceRef.current) ambienceRef.current.dispose();
      if (masterVolumeRef.current) masterVolumeRef.current.dispose();
      if (analyserRef.current) analyserRef.current.dispose();
    };
  }, []);
  
  // Handle volume changes
  useEffect(() => {
    if (masterVolumeRef.current) {
      masterVolumeRef.current.volume.value = Tone.gainToDb(volume);
    }
  }, [volume]);
  
  // Handle BPM changes
  useEffect(() => {
    Tone.Transport.bpm.value = bpm;
  }, [bpm]);
  
  // Handle bass intensity changes
  useEffect(() => {
    if (bassSynthRef.current) {
      bassSynthRef.current.volume.value = Tone.gainToDb(bassIntensity);
    }
  }, [bassIntensity]);
  
  // Handle melody intensity changes
  useEffect(() => {
    if (toneSynthRef.current) {
      toneSynthRef.current.volume.value = Tone.gainToDb(melodyIntensity);
    }
  }, [melodyIntensity]);
  
  // Toggle play/pause
  const togglePlay = async () => {
    if (!isPlaying) {
      await Tone.start();
      
      // Bass pattern
      const bassPattern = new Tone.Pattern((time, note) => {
        bassSynthRef.current.triggerAttackRelease(note, '2n', time);
      }, ['C2', 'C2', 'G1', 'G1'], 'up');
      
      // Melody pattern
      const melodyPattern = new Tone.Pattern((time, note) => {
        toneSynthRef.current.triggerAttackRelease(note, '8n', time);
      }, ['C4', 'E4', 'G4', 'B4', 'A4', 'G4'], 'randomWalk');
      
      // Hi-hat pattern
      const hiHatPattern = new Tone.Pattern((time) => {
        hiHatRef.current.triggerAttackRelease('16n', time);
      }, [0, 1, 0, 1, 1, 0, 1, 1], 'up');
      
      // Ambient pattern
      const ambientNotes = ['C3', 'E3', 'G3', 'B3'];
      new Tone.Loop((time) => {
        ambienceRef.current.triggerAttackRelease(ambientNotes, '4m', time);
      }, '4m').start(0);
      
      // Start patterns
      bassPattern.start(0).interval = '2n');
      melodyPattern.start('1m').interval = '4n');
      hiHatPattern.start(0).interval = '8n');
      
      Tone.Transport.start();
      setIsPlaying(true);
    } else {
      Tone.Transport.stop();
      setIsPlaying(false);
    }
  };
  
  // Toggle visualizer types
  const toggleVisualizer = (type: VisualizerType) => {
    setActiveVisualizers(prev => {
      if (prev.includes(type)) {
        return prev.filter(v => v !== type);
      }
      return [...prev, type];
    });
  };
  
  // Volume setter
  const setVolume = (value: number) => {
    setVolumeState(value);
  };
  
  // BPM setter
  const setBpm = (value: number) => {
    setBpmState(value);
  };
  
  return (
    <AudioVisualContext.Provider
      value={{
        isPlaying,
        togglePlay,
        volume,
        setVolume,
        bpm,
        setBpm,
        activeVisualizers,
        toggleVisualizer,
        bassIntensity,
        setBassIntensity,
        melodyIntensity,
        setMelodyIntensity,
        audioAnalyser: analyserRef.current,
        audioData,
      }}
    >
      {children}
    </AudioVisualContext.Provider>
  );
};
