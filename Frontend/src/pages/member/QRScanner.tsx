// components/QRScanner.tsx
import { Html5Qrcode, Html5QrcodeResult } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Camera } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { checkInMemberByQRfeth } from "@/store/memberAuth/memberAuthThunk";
import { playSuccessSound, vibrateSuccess } from "@/components/utils/helper";

interface QRScannerProps {
  onScanSuccess: (result: string) => void;
  onClose: () => void;
}

export default function QRScanner({ onScanSuccess, onClose }: QRScannerProps) {
  const [scannerResult, setScannerResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const qrboxElementRef = useRef<HTMLDivElement>(null);
  const {memberProfile,isLoading}=useSelector((state:RootState)=>state.memberAuth)
  const dispatch = useDispatch<AppDispatch>();
  const successAudioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    if (!isScanning) return;

    const startScanner = async () => {
      try {
        // Create a new instance of Html5Qrcode
        scannerRef.current = new Html5Qrcode("reader");
        
        // Start the camera directly without showing any file selection
        await scannerRef.current.start(
          { facingMode: "environment" }, // This forces the back camera
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText: string) => {
            console.log(`QR Code detected: ${decodedText}`);
            setScannerResult(decodedText);
            // onScanSuccess(decodedText);
            // setIsScanning(false);
            stopScanner();
          },
          (errorMessage: string) => {
            // This is called for every frame where no QR is detected
            // We can ignore these warnings
          }
        );
      } catch (err) {
        console.error(`Failed to start scanner: ${err}`);
        // Handle error, maybe show a message to the user
      }
    };

    const stopScanner = () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop()
          .then(() => {
            console.log("Scanner stopped");
          })
          .catch((err) => {
            console.error(`Failed to stop scanner: ${err}`);
          });
      }
    };

    startScanner();

    return () => {
      stopScanner();
    };
  }, [isScanning, onScanSuccess]);

  useEffect(() => {
    const memberCheckIn = async() => {
     try {
      successAudioRef.current = new Audio("/sounds/success.mp3");
      if (scannerResult) {
        const response = await dispatch(checkInMemberByQRfeth(scannerResult));
        if (checkInMemberByQRfeth.fulfilled.match(response)) {
        // ✅ API SUCCESS 
        vibrateSuccess();
        // playSuccessSound();
         successAudioRef.current?.play().catch(() => {});
      }
        console.log("Check-in response:", response);
      }
     } catch (error) {
      console.error("Error during member check-in:", error);
     }
    };
    memberCheckIn();
  }, [scannerResult]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
            <Camera className="h-5 w-5 text-orange-400" />
            QR Code Scanner
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {scannerResult ? isLoading?
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          :(
            <div className="text-center py-6">
              <div className="text-green-400 font-medium mb-2">Scan Successful!</div>
              <div className="text-white bg-slate-700/50 p-3 rounded-lg break-all">
                {scannerResult}
              </div>
              <Button
                onClick={onClose}
                className="mt-4 w-full bg-orange-500 hover:bg-orange-600"
              >
                Close
              </Button>
            </div>
          ) : (
            <div>
              <div className="text-slate-300 text-sm mb-3">
                Position the QR code within the frame to scan
              </div>
              <div id="reader" className="w-full overflow-hidden rounded-lg" ref={qrboxElementRef}></div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}