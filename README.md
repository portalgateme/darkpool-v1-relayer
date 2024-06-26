

*The following instructions are for Ubuntu 22.10, other operating systems may vary. These instructions include automated SSL configuration with LetsEncrypt.*

__PREREQUISITES__
1. Update core dependencies 
  - `sudo apt-get update` 
2. Install docker-compose
  - `curl -SL https://github.com/docker/compose/releases/download/v2.16.0/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose && sudo chmod +x /usr/local/bin/docker-compose`
3. Install Docker
  - `curl -fsSL https://get.docker.com -o get-docker.sh && chmod +x get-docker.sh && ./get-docker.sh` 
4. Install git
  - `sudo apt-get install git-all` 
5. Install nginx
  - `sudo apt install nginx` 
6. Stop apache2 instance (enabled by default)
  - `sudo systemctl stop apache2`

__FIREWALL CONFIGURATION__ 

_* Warning: Failure to configure SSH as the first UFW rule, will lock you out of the instance_ 

1. Make sure UFW is installed by running `apt update` and `apt install ufw` 
2. Allow SSH in the first position in UFW by running `ufw insert 1 allow ssh`*
3. Allow HTTP, and HTTPS by running `ufw allow https/tcp/http`
4. Finalise changes and enable firewall `ufw enable`

__NETWORK DEPLOYMENT OPTIONS__ 

_Ethereum (eth), Binance (bnb), Gnosis (xdai), Polygon (matic), Optimisim (op), Arbitrum (arb) and Goerli (geth), and Sepolia (SepoliaETH)_

__SINGLE NETWORK DEPLOYMENT__
1. Clone the repository and enter the directory 
  - `git clone  && cd classic-relayer`
2. Clone the example enviroment file `.env.example` to configure for the perferred network 
  - By default each network is preconfigured the naming of `.env.<NETWORK SYMBOL>`
  - `cp .env.example .env.eth` 
  - Set `PRIVATE_KEY` for your relayer address (remove the 0x from your private key)
  - Set `VIRTUAL_HOST` and `LETSENCRYPT_HOST` to your domain address
    - add a A  record DNS record with the value assigned to your instance IP address to configure the domain
  - Set `RELAYER_FEE` to what you would like to charge as your fee (remember 0.3% is deducted from your staked relayer balance)
  - Set `RPC_URL` to a non-censoring RPC endpoint (You can [run your own](https://github.com/feshchenkod/rpc-nodes), or use a [free option](https://chainnodes.org/))
  - Set `ORACLE_RPC_URL` to an Ethereum native RPC endpoint
4. Uncomment the `env_file` lines (remove `# `) for the associated network services in `docker-compose.yml`
5. Build and deploy the docker source by specifying the network through `--profile <NETWORK_SYMBOL>`
  - `docker-compose --profile eth up -d`
5. Visit your domain address and check the `/status` endpoint and ensure there is no errors in the `status` field

__NGINX REVERSE PROXY__
1. Copy the pre-modified nginx policy as your default policy 
  - `cp pg-darkpool.conf /etc/nginx/sites-available/default` 
2. Append the default nginx configuraiton to include streams
  - `echo "stream {  map_hash_bucket_size 128;  map_hash_max_size 128;  include /etc/nginx/conf.d/streams/*.conf; }" >> /etc/nginx/nginx.conf`
3. Create the stream configruation
  - `mkdir /etc/nginx/conf.d/streams && cp pg-darkpool-stream.conf /etc/nginx/conf.d/streams/pg-darkpool-stream.conf`
4. Start nginx to make sure the configuration is correct 
  - `sudo systemctl restart nginx`
5. Stop nginx
  - `sudo systemctl stop nginx`

__MULTIPLE NETWORK DEPLOYMENT__
1. Setup the instructions stated to setup an nginx reverse proxy
2. Clone the example enviroment file `.env.example` for the networks of choice and configure
  - By default each network is preconfigured the naming of `.env.<NETWORK SYMBOL>`
  - `cp .env.example .env.eth` 
  - `cp .env.example .env.bnb`
  - `cp .env.example .env.arb`
  - `cp .env.example .env.op`
  - `cp .env.example .env.xdai`
  - Set `PRIVATE_KEY` to your relayer address (remove the 0x from your private key) to each environment file
    - *It is recommended not to reuse the same private keys for each network as a security measure*
  - Set `VIRTUAL_HOST` and `LETSENCRYPT_HOST` a unique subndomain for every network to each environment file
    - eg: `mainnet.example.com` for Ethereum, `binance.example.com` for Binance etc
    - ensure that the parent domain domain is specified first with the subdomain after sperated by a comma for SAN certificates
      - eg: `VIRTUAL_HOST=example.com,eth.example.com` and `LETSENCRYPT_HOST=example.com,eth.example.com` 
    - add a A wildcard record DNS record with the value assigned to your instance IP address to configure submdomains
  - Set `RELAYER_FEE` to what you would like to charge as your fee (remember 0.3% is deducted from your staked relayer balance)
  - Set `RPC_URL` to a non-censoring RPC (You can [run your own](https://github.com/feshchenkod/rpc-nodes), or use a [free option](https://chainnodes.org/))
  - Set `ORACLE_RPC_URL` to an Ethereum native RPC endpoint
3. Uncomment the `env_file` lines (remove `# `) for the associated network services in `docker-compose.yml`
4. Build and deploy the docker source for the configured neworks specified via `--profile <NETWORK_SYMBOL>`
  - `docker-compose --profile eth --profile bnb --profile arb --profile --profile op --profile xdai up -d`
5. Visit your domain addresses and check each `/status` endpoint to ensure there is no errors in the `status` fields

## Run locally

1. `npm i`
2. `cp .env.example .env`
3. Modify `.env` as needed
4. `npm run start`
5. Go to `http://127.0.0.1:8000`
6. In order to execute withdraw request, you can run following command

```bash
curl -X POST -H 'content-type:application/json' --data '<input data>' http://127.0.0.1:8000/relay
```

Relayer should return a transaction hash.

_Note._ If you want to change contracts' addresses go to [config.js](./config/config.js) file.

## Input data example

```json
{
  "proof": "0x0f8cb4c2ca9cbb23a5f21475773e19e39d3470436d7296f25c8730d19d88fcef2986ec694ad094f4c5fff79a4e5043bd553df20b23108bc023ec3670718143c20cc49c6d9798e1ae831fd32a878b96ff8897728f9b7963f0d5a4b5574426ac6203b2456d360b8e825d8f5731970bf1fc1b95b9713e3b24203667ecdd5939c2e40dec48f9e51d9cc8dc2f7f3916f0e9e31519c7df2bea8c51a195eb0f57beea4924cb846deaa78cdcbe361a6c310638af6f6157317bc27d74746bfaa2e1f8d2e9088fd10fa62100740874cdffdd6feb15c95c5a303f6bc226d5e51619c5b825471a17ddfeb05b250c0802261f7d05cf29a39a72c13e200e5bc721b0e4c50d55e6",
  "args": [
    "0x1579d41e5290ab5bcec9a7df16705e49b5c0b869095299196c19c5e14462c9e3",
    "0x0cf7f49c5b35c48b9e1d43713e0b46a75977e3d10521e9ac1e4c3cd5e3da1c5d",
    "0x03ebd0748aa4d1457cf479cce56309641e0a98f5",
    "0xbd4369dc854c5d5b79fe25492e3a3cfcb5d02da5",
    "0x000000000000000000000000000000000000000000000000058d15e176280000",
    "0x0000000000000000000000000000000000000000000000000000000000000000"
  ],
  "contract": "0xA27E34Ad97F171846bAf21399c370c9CE6129e0D"
}
```

Disclaimer:

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
