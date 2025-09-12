import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Switch,
  Typography,
} from '@mui/material';
import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { IdleState } from 'src/services/states/idle-state';
import { Message } from 'src/types/message';
import { Speaker } from 'src/types/speaker';

import { TranscriptOrchestrator } from '../../services/transcript-orchestrator';
import { InterruptStrategy } from '../../services/transcript-strategies';
import { ChannelMetadata } from '../../types/transcript';

interface SpeakerControlProps {
  speaker: Speaker;
  onMute: (channelId: string) => void;
  onUnmute: (channelId: string) => void;
  // onSpeak: (channelId: string, text: string, isFinal: boolean) => void;
  // bufferedCount: number;
}

const SpeakerControl: React.FC<SpeakerControlProps> = ({
  speaker,
  onMute,
  onUnmute,
  // onSpeak,
  // bufferedCount,
}) => {
  const [isSimulatingSpeech, setIsSimulatingSpeech] = useState(false);
  const [speechText, setSpeechText] = useState('');

  // const simulateSpeech = useCallback(
  //   (text: string, finalText: string) => {
  //     if (isSimulatingSpeech) return;

  //     setIsSimulatingSpeech(true);
  //     const words = text.split(' ');
  //     let currentText = '';

  //     // Send partial transcriptions
  //     words.forEach((word, index) => {
  //       setTimeout(() => {
  //         currentText += (index > 0 ? ' ' : '') + word;
  //         onSpeak(speaker.channelId, currentText, false);

  //         if (index === words.length - 1) {
  //           // Send final transcription
  //           setTimeout(() => {
  //             onSpeak(speaker.channelId, finalText, true);
  //             setIsSimulatingSpeech(false);
  //             setSpeechText('');
  //           }, 500);
  //         }
  //       }, index * 300);
  //     });
  //   },
  //   [speaker.channelId, onSpeak, isSimulatingSpeech]
  // );

  // const handleQuickSpeak = (text: string) => {
  //   const finalText = `${speaker.displayName}: ${text}`;
  //   simulateSpeech(text, finalText);
  // };

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="between" mb={1}>
          <Typography variant="h6" component="div">
            {speaker.name}
            <Chip
              size="small"
              label={`Priority: ${speaker.priority}`}
              color={speaker.isActive ? 'success' : 'default'}
              sx={{ ml: 1 }}
            />
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
          <FormControlLabel
            control={
              <Switch
                checked={!speaker.isMuted}
                onChange={(e) =>
                  e.target.checked
                    ? onUnmute(speaker.channelId)
                    : onMute(speaker.channelId)
                }
                size="small"
              />
            }
            label={speaker.isMuted ? 'Muted' : 'Active'}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export const TranscriptDemo: React.FC = () => {
  const [orchestrator, setOrchestrator] =
    useState<TranscriptOrchestrator | null>(null);
  const [transcriptHistory, setTranscriptHistory] = useState<Message[]>([]);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [channelStats, setChannelStats] = useState<{
    [channelId: string]: { buffered: number; active: boolean };
  }>({});
  const [currentStrategy, setCurrentStrategy] = useState<
    'interrupt' | 'queue' | 'fcfs'
  >('interrupt');
  const [isRunning, setIsRunning] = useState(false);

  const initAsr = useCallback(async () => {
    const orch = new TranscriptOrchestrator((streams: Message[]) => {
      setTranscriptHistory(streams);
    });

    orch.setState(new IdleState(orch));
    // Create demo speakers
    const demoSpeakers: ChannelMetadata[] = [
      {
        channelId: 'Accused',
        speakerId: 'accused-001',
        port: 7001,
        priority: 5,
        isActive: false,
        isMuted: false,
        displayName: 'Accused',
      },
      {
        channelId: 'Judge',
        speakerId: 'judge-002',
        port: 7002,
        priority: 10,
        isActive: false,
        isMuted: false,
        displayName: 'Judge',
      },
      {
        channelId: 'AttorneyMamber',
        speakerId: 'AttorneyMamber-003',
        port: 7003,
        priority: 3,
        isActive: false,
        isMuted: false,
        displayName: 'AttorneyMamber',
      },
    ];

    await orch.initializeASR();

    // Add channels to orchestrator (using dummy WebSocket URLs since we'll simulate)
    const newSpeakers = demoSpeakers.map((speaker) => {
      return orch.addSpeaker(
        speaker.displayName,
        speaker.channelId,
        `ws://localhost:${speaker.port}`,
        speaker.priority
      );
    });

    setSpeakers(newSpeakers);
    setOrchestrator(orch);
  }, []);

  // Initialize orchestrator

  const handleStrategyChange = async (
    strategy: 'interrupt' | 'queue' | 'fcfs'
  ) => {
    await initAsr();
    // if (!orchestrator) return;

    // let strategyInstance;
    // switch (strategy) {
    //   case 'interrupt':
    //     strategyInstance = new InterruptStrategy();
    //     break;
    //   case 'queue':
    //     strategyInstance = new QueueStrategy();
    //     break;
    //   case 'fcfs':
    //     strategyInstance = new FirstComeFirstServedStrategy();
    //     break;
    // }

    // orchestrator.setStrategy(strategyInstance);
    // setCurrentStrategy(strategy);
  };

  const handleMute = (channelId: string) => {
    if (!orchestrator) return;
    const speaker = orchestrator.muteSpeaker(channelId);
    if (speaker) {
      setSpeakers((prev) =>
        prev.map((s) => (s.channelId === channelId ? speaker : s))
      );
    }
  };

  const handleUnmute = (channelId: string) => {
    if (!orchestrator) return;
    const speaker = orchestrator.unmuteSpeaker(channelId);
    if (speaker) {
      setSpeakers((prev) =>
        prev.map((s) => (s.channelId === channelId ? speaker : s))
      );
    }
  };

  // const handleSpeak = (channelId: string, text: string, isFinal: boolean) => {
  //   if (!orchestrator) return;
  //   const channel = (orchestrator as any).channels.get(channelId);
  //   if (channel) {
  //     channel.simulateMessage(text, isFinal, 0.95);

  //     // Update speaker active state in UI
  //     if (isFinal) {
  //       setSpeakers((prev) =>
  //         prev.map((s) =>
  //           s.channelId === channelId ? { ...s, isActive: false } : s
  //         )
  //       );
  //     } else {
  //       setSpeakers((prev) =>
  //         prev.map((s) =>
  //           s.channelId === channelId ? { ...s, isActive: true } : s
  //         )
  //       );
  //     }
  //   }
  // };

  // const runDemoScenario = async () => {
  //   if (!orchestrator || isRunning) return;

  //   setIsRunning(true);
  //   orchestrator.clearTranscript();

  //   try {
  //     // Scenario: Alice starts speaking
  //     await new Promise((resolve) => setTimeout(resolve, 1000));
  //     handleSpeak(
  //       'alice',
  //       'Alice: Hello everyone, I wanted to discuss the quarterly results...',
  //       false
  //     );

  //     await new Promise((resolve) => setTimeout(resolve, 2000));
  //     handleSpeak(
  //       'alice',
  //       'Alice: Hello everyone, I wanted to discuss the quarterly results and our future plans',
  //       false
  //     );

  //     // Bob interrupts (higher priority)
  //     await new Promise((resolve) => setTimeout(resolve, 1500));
  //     handleSpeak(
  //       'bob',
  //       'Bob: Sorry to interrupt, but we have an urgent situation',
  //       false
  //     );

  //     await new Promise((resolve) => setTimeout(resolve, 1000));
  //     handleSpeak(
  //       'bob',
  //       'Bob: Sorry to interrupt, but we have an urgent situation that needs immediate attention',
  //       true
  //     );

  //     // Charlie tries to speak but gets buffered (lower priority)
  //     await new Promise((resolve) => setTimeout(resolve, 500));
  //     handleSpeak(
  //       'charlie',
  //       'Charlie: I also have something important to say',
  //       false
  //     );

  //     await new Promise((resolve) => setTimeout(resolve, 1000));
  //     handleSpeak(
  //       'charlie',
  //       'Charlie: I also have something important to say about the budget',
  //       true
  //     );

  //     // Bob finishes, Charlie's buffered message should now be processed
  //     await new Promise((resolve) => setTimeout(resolve, 2000));
  //   } finally {
  //     setIsRunning(false);
  //   }
  // };

  const clearTranscript = () => {
    orchestrator?.clearTranscript();
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Real-Time Transcript System Demo
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        This demo simulates a real-time transcript system with speaker priority
        management and interruption handling.
      </Alert>

      <Grid container spacing={3}>
        {/* Controls */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Controls
              </Typography>

              <Box mb={2}>
                <Typography variant="subtitle2" gutterBottom>
                  Strategy:
                </Typography>
                <ButtonGroup size="small" fullWidth>
                  <Button
                    variant={
                      currentStrategy === 'interrupt' ? 'contained' : 'outlined'
                    }
                    onClick={() => handleStrategyChange('interrupt')}
                  >
                    Interrupt
                  </Button>
                  <Button
                    variant={
                      currentStrategy === 'queue' ? 'contained' : 'outlined'
                    }
                    onClick={() => handleStrategyChange('queue')}
                  >
                    Queue
                  </Button>
                  <Button
                    variant={
                      currentStrategy === 'fcfs' ? 'contained' : 'outlined'
                    }
                    onClick={() => handleStrategyChange('fcfs')}
                  >
                    FCFS
                  </Button>
                </ButtonGroup>
              </Box>

              {/* <Box display="flex" gap={1} flexWrap="wrap">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={runDemoScenario}
                  disabled={isRunning}
                  startIcon={<PlayArrow />}
                >
                  {isRunning ? 'Running...' : 'Run Demo'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={clearTranscript}
                  startIcon={<Clear />}
                >
                  Clear
                </Button>
              </Box> */}
            </CardContent>
          </Card>

          <Box mt={2}>
            <Typography variant="h6" gutterBottom>
              Speakers
            </Typography>
            {speakers.map((speaker) => (
              <SpeakerControl
                key={speaker.channelId}
                speaker={speaker}
                onMute={handleMute}
                onUnmute={handleUnmute}
                // onSpeak={handleSpeak}
                // bufferedCount={channelStats[speaker.channelId]?.buffered || 0}
              />
            ))}
          </Box>
        </Grid>

        {/* Transcript Display */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Live Transcript
              </Typography>

              <Paper
                variant="outlined"
                sx={{
                  height: 400,
                  overflow: 'auto',
                  p: 2,
                  bgcolor: 'background.default',
                }}
              >
                {transcriptHistory.length === 0 ? (
                  <Typography color="text.secondary" textAlign="center">
                    No transcript yet. Start speaking or run the demo scenario.
                  </Typography>
                ) : (
                  <List dense>
                    {transcriptHistory.map((stream, index) => (
                      <React.Fragment key={stream.id}>
                        <ListItem disableGutters>
                          <ListItemText
                            primary={
                              <Box display="flex" alignItems="center" gap={1}>
                                <Typography
                                  variant="body2"
                                  color={
                                    stream.speaker.channel.id === 'system'
                                      ? 'warning.main'
                                      : 'text.primary'
                                  }
                                  component="span"
                                >
                                  {stream.text}
                                </Typography>
                                {stream.isFinal && (
                                  <Chip
                                    size="small"
                                    label="Final"
                                    color="success"
                                  />
                                )}
                                {!stream.isFinal && (
                                  <Chip
                                    size="small"
                                    label="Pending"
                                    color="default"
                                  />
                                )}
                              </Box>
                            }
                            secondary={
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {new Date(
                                  stream.timestamp
                                ).toLocaleTimeString()}{' '}
                                • Channel: {stream.channelId} • Message:{' '}
                                {stream.messageId} • Sequence:{' '}
                              </Typography>
                            }
                          />
                        </ListItem>
                        {index < transcriptHistory.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </Paper>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
