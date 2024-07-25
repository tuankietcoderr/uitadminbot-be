import { Module } from '@nestjs/common';
import { CredentialService } from './credential.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Credential, CredentialSchema } from 'src/shared/entities';

@Module({
  imports: [],
  providers: [CredentialService],
  exports: [CredentialService]
})
export class CredentialModule {}
