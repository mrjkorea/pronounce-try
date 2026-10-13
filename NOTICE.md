# Notices

The pronounce try page grades in the browser with Citrinet only (int8 ONNX, onnxruntime-web WASM). After the model files are on the page, a take does not send audio off the device.

- Citrinet: `model.int8.onnx` and `tokens.txt` from the sherpa-onnx release `sherpa-onnx-nemo-ctc-en-citrinet-512`. The weights are NVIDIA's `stt_en_citrinet_512` model, license CC-BY-4.0. The sentence pieces come from that model's SentencePiece tokenizer (`tokenizer.model`).
