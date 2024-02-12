import { BusinessPartnerService } from './business-partner/business-partner.service';
import { BusinessPartnerController } from './business-partner/business-partner.controller';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SalesOrderController } from './sales-order/sales-order.controller';
import { SalesOrderService } from './sales-order/sales-order.service';

@Module({
  imports: [],
  controllers: [
        BusinessPartnerController, AppController, SalesOrderController],
  providers: [
        BusinessPartnerService, AppService, SalesOrderService],
})
export class AppModule {}
