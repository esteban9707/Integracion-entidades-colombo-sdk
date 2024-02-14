import { Injectable } from '@nestjs/common';
import {
  BusinessPartner,
  BusinessPartnerAddress,
  businessPartnerService,
} from '../../services/business-partner-service';

const { businessPartnerApi, businessPartnerAddressApi, buPaAddressUsageApi } =
  businessPartnerService();

@Injectable()
export class BusinessPartnerService {
  destination = {
    url: 'https://my405807-api.s4hana.cloud.sap',
    username: 'USER_ADMINISTRATOR_HBT',
    password: 'AHyGnbty8neBGTVtGtbgJmpyoV#VtibskwjUTUou',
  };

  async getAllBusinessPartners(): Promise<BusinessPartner[]> {
    return await businessPartnerApi
      .requestBuilder()
      .getAll()
      .filter(businessPartnerApi.schema.BUSINESS_PARTNER_CATEGORY.equals('1'))
      .execute(this.destination);
  }

  async getBusinessPartnerById(id: string): Promise<BusinessPartner> {
    return await businessPartnerApi
      .requestBuilder()
      .getByKey(id)
      .execute(this.destination);
  }

  async createBusinessPartner(BusinessPartner: Record<string, any>) {
    try {
      let businessPartnerAdress: any[] = [];
      const businessPartnerAdressArray =
        BusinessPartner.to_BusinessPartnerAddress;

      if (businessPartnerAdressArray) {
        businessPartnerAdress = businessPartnerAdressArray.map((bpAdress) => {
          return businessPartnerAddressApi.entityBuilder().fromJson(bpAdress);
        });
      }

      const businessPartnerEntity = businessPartnerApi
        .entityBuilder()
        .toBusinessPartnerAddress(businessPartnerAdress)
        .fromJson(BusinessPartner);

      return await businessPartnerApi
        .requestBuilder()
        .create(businessPartnerEntity)
        .addCustomHeaders({ Accept: 'application/json' })
        .execute(this.destination);
    } catch (error) {
      console.error('Error en createSalesOrder:', error);
      throw error;
    }
  }

  async updateBusinessPartner(
    requestBody,
    businessPartnerId,
  ): Promise<BusinessPartner> {
    try {
      const response = await businessPartnerApi
        .requestBuilder()
        .getByKey(businessPartnerId)
        .addCustomHeaders({ Accept: 'application/json' })
        .execute(this.destination);

      Object.assign(response, requestBody);

      return await businessPartnerApi
        .requestBuilder()
        .update(response)
        .execute(this.destination);
    } catch (error) {
      console.error('Error en updateSalesOrder:', error);
      throw error;
    }
  }

  async createAddress(
    address: Record<string, any>,
    businessPartnerId: string,
  ): Promise<BusinessPartnerAddress> {
    let businessPartnerAdressUsagge: any[] = [];
    const businessPartnerAdressArraysagge = address.to_AddressUsage;

    if (businessPartnerAdressArraysagge) {
      businessPartnerAdressUsagge = businessPartnerAdressArraysagge.map(
        (Adress) => {
          return buPaAddressUsageApi.entityBuilder().fromJson(Adress);
        },
      );
    }

    const businessPartnerAddress = businessPartnerAddressApi
      .entityBuilder()
      .toAddressUsage(businessPartnerAdressUsagge)
      .fromJson({ businessPartner: businessPartnerId, ...address });

    return await businessPartnerAddressApi
      .requestBuilder()
      .create(businessPartnerAddress)
      .addCustomHeaders({ Accept: 'application/json' })
      .execute(this.destination);
  }

  async updateAddress(
    address: Record<string, any>,
    businessPartnerId: string,
    addressId: string,
  ): Promise<BusinessPartnerAddress> {
    const businessPartnerAddress = businessPartnerAddressApi
      .entityBuilder()
      .fromJson({ businessPartner: businessPartnerId, addressId, ...address });

    return await businessPartnerAddressApi
      .requestBuilder()
      .update(businessPartnerAddress)
      .addCustomHeaders({ Accept: 'application/json' })
      .execute(this.destination);
  }

  async deleteAddress(
    businessPartnerId: string,
    addressId: string,
  ): Promise<void> {
    return await businessPartnerAddressApi
      .requestBuilder()
      .delete(businessPartnerId, addressId)
      .addCustomHeaders({ apikey: process.env.APIKEY })
      .execute(this.destination);
  }
}
