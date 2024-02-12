import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  BusinessPartner,
  BusinessPartnerAddress,
} from '../../services/business-partner-service';
import { BusinessPartnerService } from './business-partner.service';

@Controller('business-partner')
export class BusinessPartnerController {
  constructor(private businessPartnerService: BusinessPartnerService) {}

  // Obtener todos los clientes
  @Get()
  async getBusinessPartners(): Promise<BusinessPartner[]> {
    return await this.businessPartnerService
      .getAllBusinessPartners()
      .catch((error) => {
        throw new HttpException(
          `Failed to get business partners - ${error.cause?.message}`,
          500,
        );
      });
  }

  // Obtener cliente a través de id
  @Get('/:id')
  async getBusinessPartnerById(
    @Param('id') id: string,
  ): Promise<BusinessPartner> {
    return await this.businessPartnerService
      .getBusinessPartnerById(id)
      .catch((error) => {
        console.log('Error: ', error.message);
        console.log('Error: ', error);

        throw new HttpException(
          `Failed to get business partners - ${error.cause?.message}`,
          500,
        );
      });
  }

  // Crear cliente
  @Post('/create')
  @HttpCode(201)
  async createBusinessPartner(
    @Body() requestBody: Record<string, any>,
  ): Promise<BusinessPartner> {
    return await this.businessPartnerService
      .createBusinessPartner(requestBody)
      .catch((error) => {
        throw new HttpException(
          `Failed to create business partner - ${error.cause?.message}`,
          500,
        );
      });
  }

  // Editar un cliente
  @Put('/:businessPartnerId')
  async updateSalesOrder(
    @Body() requestBody: Record<string, any>,
    @Param('businessPartnerId') businessPartnerId: string,
  ): Promise<BusinessPartner> {
    return await this.businessPartnerService
      .updateBusinessPartner(requestBody, businessPartnerId)
      .catch((error) => {
        throw new HttpException(
          `Failed to update business partner - ${error.cause?.message}`,
          500,
        );
      });
  }

  // Crear dirección
  @Post('/:businessPartnerId/address')
  @HttpCode(201)
  async createAddress(
    @Body() requestBody: Record<string, any>,
    @Param('businessPartnerId') businessPartnerId: string,
  ): Promise<BusinessPartnerAddress> {
    return await this.businessPartnerService
      .createAddress(requestBody, businessPartnerId)
      .catch((error) => {
        throw new HttpException(
          `Failed to post business parner - ${error.cause?.message}`,
          500,
        );
      });
  }

  // Actualizar dirección
  @Put('/:businessPartnerId/address/:addressId')
  async updateBusinessPartnerAddress(
    @Body() requestBody: Record<string, any>,
    @Param('businessPartnerId') businessPartnerId: string,
    @Param('addressId') addressId: string,
  ): Promise<BusinessPartnerAddress> {
    return await this.businessPartnerService
      .updateAddress(requestBody, businessPartnerId, addressId)
      .catch((error) => {
        throw new HttpException(
          `Failed to update business partner - ${error.cause?.message}`,
          500,
        );
      });
  }

  // Borrar dirección
  @Delete('/:businessPartnerId/address/:addressId')
  async deleteBusinessPartnerAddress(
    @Param('businessPartnerId') businessPartnerId: string,
    @Param('addressId') addressId: string,
  ): Promise<void> {
    return await this.businessPartnerService
      .deleteAddress(businessPartnerId, addressId)
      .catch((error) => {
        throw new HttpException(
          `Failed to delete address - ${error.cause?.message}`,
          500,
        );
      });
  }
}
