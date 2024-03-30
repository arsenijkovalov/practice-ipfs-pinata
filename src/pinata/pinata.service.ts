import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import PinataClient, { PinataPinOptions, PinataPinResponse } from '@pinata/sdk';
import axios from 'axios';
import { ConfigSchema } from 'src/config/config.schema';
import { ConfigService } from 'src/config/config.service';
import { inspect } from 'util';

@Injectable()
export class PinataService {
  private readonly logger: Logger = new Logger(PinataService.name);
  private readonly pinataClient: PinataClient;
  private readonly ipfsGateway: string = 'https://gateway.pinata.cloud';

  constructor(private readonly configService: ConfigService<ConfigSchema>) {
    this.pinataClient = new PinataClient({
      pinataApiKey: this.configService.get<string>('PINATA_API_KEY'),
      pinataSecretApiKey: this.configService.get<string>(
        'PINATA_SECRET_API_KEY',
      ),
      pinataJWTKey: this.configService.get<string>('PINATA_JWT_KEY'),
    });
  }

  async uploadFile(
    readableStream: any,
    options?: PinataPinOptions,
  ): Promise<PinataPinResponse> {
    try {
      return await this.pinataClient.pinFileToIPFS(readableStream, options);
    } catch (error) {
      const msg = 'Failed to upload file to IPFS';
      this.logger.error(msg, inspect(error, { depth: 3 }));

      throw new InternalServerErrorException(msg);
    }
  }

  async downloadFile<T>({
    ipfsGateway,
    fileURI,
    params,
  }: {
    ipfsGateway?: string;
    fileURI: string;
    params?: {
      [param: string]: any;
    };
  }): Promise<T> {
    try {
      if (!ipfsGateway) {
        ipfsGateway = this.ipfsGateway;
      }

      let url = `${ipfsGateway}${fileURI}`;
      if (params && Object.keys(params).length) {
        Object.entries(params).forEach(([key, value]) => {
          url += `?${key}=${value}`;
        });
      }

      return (await axios(url)).data;
    } catch (error) {
      const msg = 'Failed to download file from IPFS';
      this.logger.error(msg, inspect(error, { depth: 3 }));

      throw new InternalServerErrorException(msg);
    }
  }
}
