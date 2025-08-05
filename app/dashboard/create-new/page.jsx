"use client"
import React, { useState, useRef } from 'react'
import SelectTopic from './_components/SelectTopic'
import SelectStyle from './_components/SelectStyle';
import SelectDuration from './_components/SelectDuration';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import CustomLoading from './_components/CustomLoading';
import { v4 as uuidv4 } from 'uuid';
import SelectAdvancedVoice from './_components/SelectAdvancedVoice';
import { useUser } from "@clerk/nextjs";

function CreateNew() {
  const { user } = useUser();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [videoScript, setVideoScript] = useState();
  const [audioUrl, setAudioUrl] = useState(null);
  const audioPlayerRef = useRef(null);
  const [generatingAudio, setGeneratingAudio] = useState(false);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);

  const onHandleInputChange = (fielName, fieldValue) => {
    console.log(fielName, fieldValue)
    setFormData(prev => ({
      ...prev,
      [fielName]: fieldValue
    }))
  }

  const onCreateClickHandler = async () => {
    try {
      console.log('Create Button Clicked');
      setShowAudioPlayer(false);
      const result = await GetVideoScript();
      setShowAudioPlayer(true);
      // Handle successful response here
    } catch (error) {
      // Show error to user
      console.error('Failed to generate video script:', error.message);
    }
  }

  // Get Video Script
  const GetVideoScript = async () => {
    setLoading(true);
    try {
      // Validate form data first
      if (!formData.duration || !formData.topic || !formData.imageStyle) {
        throw new Error('Please fill in all required fields');
      }

      const prompt = `Write a script to generate ${formData.duration} video on topic: ${formData.topic} along with AI image prompt in ${formData.imageStyle} format for each scene and give me result in JSON format with imagePrompt and ContentText as field, No Plain text`;

      console.log('Sending prompt:', prompt);

      const response = await axios.post('/api/get-video-script',
        { prompt },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (!response.data) {
        throw new Error('No data received from the server');
      }

      console.log('Response received:', response.data);
      setVideoScript(response.data.result);

      // Generate audio from script
      await GenerateAudioFile(response.data.result);
      return response.data.result;
    } catch (error) {
      console.error('Error details:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };


  const GenerateAudioFile = async (videoScriptData) => {
    try {
      let script = '';
      const id = uuidv4();

      // Combine all content text pieces
      videoScriptData.forEach(item => {
        script = script + item.contentText + ' ';
      });

      console.log("Complete script:", script);

      // Store script content along with ID
      const scriptData = {
        id: id,
        content: script,
        timestamp: new Date().toISOString()
      };

      console.log("Script data with ID:", scriptData);

      setGeneratingAudio(true);

      try {
        let response;
        const useAdvancedVoice = formData.advancedVoice;

        try {
          if (useAdvancedVoice) {
            // Try ElevenLabs first
            console.log("Attempting to use ElevenLabs API...");
            response = await axios.post('/api/generate-elevenlabs-audio', {
              text: script,
              id: id,
              voiceId: formData.advancedVoice.voiceId,
              stability: formData.advancedVoice.stability,
              clarity: formData.advancedVoice.clarity,
              style: formData.advancedVoice.style
            });
          } else {
            throw new Error("Using fallback voice option");
          }
        } catch (elevenlabsError) {
          console.log("ElevenLabs failed or not selected, trying fallback...");

          try {
            // First try gTTS if voice settings exist
            if (formData.voice) {
              console.log("Trying gTTS with language settings...");
              response = await axios.post('/api/generate-audio', {
                text: script,
                id: id,
                language: formData.voice.language,
                tld: formData.voice.tld,
                slow: formData.slow || false
              });
            } else {
              throw new Error("No voice settings, using simple TTS");
            }
          } catch (gttsError) {
            console.log("gTTS failed or not selected, trying system TTS...");

            // Last resort - use the simple system TTS
            response = await axios.post('/api/generate-simple-audio', {
              text: script,
              id: id
            });
          }
        }

        if (!response.data.success) {
          throw new Error(response.data.error || "Failed to generate audio");
        }

        // Check if it's a placeholder (warning)
        if (response.data.isPlaceholder) {
          console.warn("Generated a placeholder audio file. TTS setup incomplete.");
          // You could show a warning to the user here
        }

        // Set the audio URLs for the player
        setAudioUrl(response.data.audioUrl);

        // Save script metadata with voice settings
        await axios.post('/api/save-script', {
          ...scriptData,
          audioGenerated: true,
          audioUrl: response.data.audioUrl,
          localPath: response.data.localPath,
          voiceSettings: formData.advancedVoice || formData.voice || { language: 'en', tld: 'com' },
          userId: user?.id
        });

        console.log("Audio generated and saved at:", response.data.localPath);
        return {
          scriptData,
          audioUrl: response.data.audioUrl,
          localPath: response.data.localPath
        };

      } catch (error) {
        console.error("Error generating audio:", error);
        throw error;
      } finally {
        setGeneratingAudio(false);
      }
    } catch (error) {
      console.error("Failed to process script:", error);
      throw error;
    }
  };

  const downloadAudio = () => {
    if (audioUrl) {
      // Create a link to download the file
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = `speech_${uuidv4()}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className='md:px-20'>
      <h2 className='font-bold text-3xl text-primary text-center'>
        Create New
      </h2>
      <div className='mt-10 shadow-md p-10'>
        {/* Select Topic */}
        <SelectTopic onUserSelect={onHandleInputChange} />

        {/* Select Style */}
        <SelectStyle onUserSelect={onHandleInputChange} />

        {/* Duration */}
        <SelectDuration onUserSelect={onHandleInputChange} />

        {/* Voice Selection */}
        <SelectAdvancedVoice onUserSelect={onHandleInputChange} />

        {/* Create Button */}
        <Button className="mt-10 w-full" onClick={onCreateClickHandler} disabled={loading || generatingAudio}>
          {loading ? "Creating..." : "Create Short Video"}
        </Button>

        <CustomLoading loading={loading || generatingAudio} />

        {/* Display message when generating audio */}
        {generatingAudio && (
          <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded">
            Generating audio... Please wait.
          </div>
        )}

        {/* Audio player */}
        {showAudioPlayer && audioUrl && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Audio Preview</h3>
            <audio
              ref={audioPlayerRef}
              className="w-full"
              controls
              src={audioUrl}
            >
              Your browser does not support the audio element.
            </audio>
            <Button
              className="mt-3 bg-blue-500 hover:bg-blue-600"
              onClick={downloadAudio}
            >
              Download Audio
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CreateNew