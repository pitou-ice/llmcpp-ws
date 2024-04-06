#!/bin/sh

./websocketd \
--port=8080 \
--binary=true \
--staticdir=public \
./main \
-m models/Hermes-2-Pro-Mistral-7B.Q4_K_M.gguf \
-n 512 --temp 2.0 \
-i -cml -e \
--file prompt.txt \
--no-display-prompt \
--log-disable
# -ld logs \
# --prompt-cache pcache --keep -1 \
